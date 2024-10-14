import {
	Decoration,
	DecorationSet,
	EditorView,
	PluginSpec,
	PluginValue,
	ViewPlugin,
	ViewUpdate
} from "@codemirror/view";
import InlineBiblePlugin from "../../main";
import { parseText } from "../parseText";
import { RangeSetBuilder } from "@codemirror/state";
import { decorationsStateField } from "./decorationsStateField";
import { decorationUpdateEffect } from "./decorationUpdateEffect";
import { DecorationCache } from "./DecorationCache";
import { ParseResultType } from "../ParseResultType";
import { getFilePath } from "../helper/getFilePath";
import styles from "../BibleVersesPopover/bibleVersesPopover.module.css";

export function getDecorationViewPlugin(plugin: InlineBiblePlugin) {

	class DecorationCreatorPlugin implements PluginValue {
		private editorView: EditorView;
		bibleLinks: DecorationSet;

		constructor(view: EditorView) {
			this.editorView = view;
			this.bibleLinks = this.createDecorations(view);
		}

		destroy(): void {
		}

		update(update: ViewUpdate): void {
			if (update.docChanged || update.viewportChanged || update.selectionSet) {
				this.bibleLinks = this.createDecorations(update.view);
			}
		}

		docViewUpdate(view: EditorView): void {
		}


		// This function should not be async, as the view decorations should not be async
		private createDecorations(view: EditorView) {
			const state = view.state;
			const doc = state.doc;

			const widgetBuilder = new RangeSetBuilder<Decoration>();
			const bibleLinksBuilder = new RangeSetBuilder<Decoration>();

			let decorationPromise = Promise.resolve();

			const ranges = state.selection.ranges;
			// line is 1-indexed
			for (let i = 1; i <= doc.lines; i++) {
				const line = doc.line(i);
				const results = parseText(line.text, plugin.settings.prefix);
				for (const result of results) {
					const chapterFile = plugin.app.vault.getFileByPath(getFilePath(plugin.settings.bibleLocation, result.chapter));

					if (!chapterFile) {
						throw new Error(`Chapter file not found: ${result.book} ${result.chapter} ${getFilePath(plugin.settings.bibleLocation, result.chapter)}`);
					}

					const isInsideSelection = ranges.some(range => range.from <= line.from + result.endIndex && range.to >= line.from + result.startIndex);
					if (!isInsideSelection) {
						bibleLinksBuilder.add(line.from + result.startIndex, line.from + result.endIndex, Decoration.mark({
							class: styles.popoverLink,
							tagName: "a",
							attributes: {
								"data-parse-result": JSON.stringify(result),
							},
						}))
					}

					const currentDecorationPromise = DecorationCache.instance.getDecoration(result);
					decorationPromise = decorationPromise.then(async () => {
						// Add with endIndex to not replace anything
						widgetBuilder.add(line.from + result.endIndex, line.from + result.endIndex, await currentDecorationPromise);
					})
				}
			}

			// Wait for all decorations to be created before updating the view
			decorationPromise.then(() => {
				const decorations = widgetBuilder.finish();
				if (decorations.size || this.editorView.state.field(decorationsStateField).size) {
					view.dispatch({effects: decorationUpdateEffect.of(decorations)});
				}
			})
			return bibleLinksBuilder.finish();
		}

		openLink(reference: ParseResultType, event: MouseEvent) {
			const chapterFile = plugin.app.vault.getFileByPath(getFilePath(plugin.settings.bibleLocation, reference.chapter));
			if (!chapterFile) {
				return
			}

			plugin.app.workspace.openLinkText(chapterFile.path, "", event.altKey || event.metaKey);
		}
	}

	const pluginSpec: PluginSpec<DecorationCreatorPlugin> = {
		decorations: (value: DecorationCreatorPlugin) => value.bibleLinks,
	}

	return ViewPlugin.fromClass(DecorationCreatorPlugin, pluginSpec)
}
