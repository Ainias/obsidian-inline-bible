import styles from "./widget.module.css";
import { WidgetType } from "@codemirror/view";
import { MarkdownRenderer } from "obsidian";
import InlineBiblePlugin from "../../main";
import { FootnotePopover } from "../FootnotePreview/FootnotePopover";
import noteStyles from "../notes/addNoteClass.module.css";
import { ParseResultType } from "../ParseResultType";
import { BibleVersesPopover } from "../BibleVersesPopover/BibleVersesPopover";
import { openParseResult } from "../helper/openParseResult";

export class BibleVersesWidget extends WidgetType {
	private plugin: InlineBiblePlugin;
	private markdownContent: string;
	private filePath: string;
	private reference: ParseResultType;
	private showReference: boolean;

	constructor({markdownContent, plugin, filePath, reference, showReference}: {
		markdownContent: string,
		plugin: InlineBiblePlugin,
		filePath: string,
		reference: ParseResultType,
		showReference: boolean
	}) {
		super();
		this.markdownContent = markdownContent;
		this.plugin = plugin;
		this.filePath = filePath;
		this.reference = reference;
		this.showReference = showReference;
	}

	eq(widget: BibleVersesWidget): boolean {
		return widget.markdownContent === this.markdownContent && widget.filePath === this.filePath && this.reference.bibleReference === widget.reference.bibleReference;
	}

	toDOM() {
		const container = document.createElement("div");
		container.classList.add(styles.widget);
		container.classList.add(noteStyles.bibleChapter);
		container.classList.add("markdown-rendered");
		if (this.reference.linkOnly) {
			container.classList.add(styles.linkOnly);
		}

		container.addEventListener("click", (e) => {
			if (e.target instanceof HTMLAnchorElement) {
				return;
			}

			if (e.altKey || e.metaKey) {
				openParseResult(this.plugin, this.reference, e);
			}
		});
		container.addEventListener("dblclick", (e) => {
			if (e.target instanceof HTMLAnchorElement) {
				return;
			}

			openParseResult(this.plugin, this.reference, e);
		})

		MarkdownRenderer.render(this.plugin.app, this.markdownContent, container, this.filePath, this.plugin).then(() => {
			container.querySelectorAll<HTMLLinkElement>("a.footnote-link").forEach((el) => {
				// Important to override class of obsidian or else the default popup of obsidian will also be shown
				el.className = styles.footnote;
				el.addEventListener("mouseenter", () => {
					new FootnotePopover(el);
				})
				el.addEventListener("click", (e) => {
					new FootnotePopover(el).load();
				})
			});
			if (this.showReference) {
				const el = container.querySelector<HTMLLinkElement>("a.internal-link")
				if (!el) {
					return;
				}

				// Important to override class of obsidian or else the default popup of obsidian will also be shown
				el.className = styles.footnote;

				// show popover on hover only for not shown references
				if (this.reference.linkOnly || this.reference.collapsed) {
					el.addEventListener("mouseenter", () => {
						new BibleVersesPopover(el, {plugin: this.plugin, parseResult: this.reference, withMargin: true});
					})
				}
				el.addEventListener("click", (e) => {
					openParseResult(this.plugin, this.reference, e);
				})
			}

		});
		return container;
	}
}
