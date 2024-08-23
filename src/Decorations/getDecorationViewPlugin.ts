import { Decoration, EditorView, PluginValue, ViewPlugin, ViewUpdate } from "@codemirror/view";
import InlineBiblePlugin from "../../main";
import { parseText } from "../parseText";
import { RangeSetBuilder } from "@codemirror/state";
import { BibleVersesWidget } from "./BibleVersesWidget";
import { decorationsStateField } from "./decorationsStateField";
import { decorationUpdateEffect } from "./decorationUpdateEffect";
import { buildMarkdown } from "../buildMarkdown";
import { DecorationCache } from "./DecorationCache";



export function getDecorationViewPlugin(plugin: InlineBiblePlugin) {

	class DecorationCreatorPlugin implements PluginValue {
		private editor: EditorView;

		constructor(view: EditorView) {
			this.editor = view;
			this.createAsyncDecorations(view);
		}

		destroy(): void {
		}

		update(update: ViewUpdate): void {
			if (update.docChanged || update.viewportChanged) {
				this.createAsyncDecorations(update.view);
			}
		}

		private async createAsyncDecorations(view: EditorView) {
			const state = view.state;
			const doc = state.doc;

			const rangeBuilder = new RangeSetBuilder<Decoration>();
			let decorationPromise = Promise.resolve();

			// line is 1-indexed
			for (let i = 1; i <= doc.lines; i++) {
				const line = doc.line(i);
				const results = parseText(line.text, plugin.settings.prefix);
				for (const result of results) {
					const currentDecorationPromise = DecorationCache.instance.getDecoration(result);
					decorationPromise = decorationPromise.then(async () => {
						// Add with endIndex to not replace anything
						rangeBuilder.add(line.from + result.endIndex, line.from + result.endIndex, await currentDecorationPromise);
					})
				}
			}

			// Wait for all decorations to be created before updating the view
			await decorationPromise;
			const decorations = rangeBuilder.finish();
			if (decorations.size || this.editor.state.field(decorationsStateField).size) {
				view.dispatch({effects: decorationUpdateEffect.of(decorations)});
			}
		}
	}

	return ViewPlugin.fromClass(DecorationCreatorPlugin)
}
