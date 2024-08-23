import styles from "./widget.module.css";
import { WidgetType } from "@codemirror/view";
import { MarkdownRenderer } from "obsidian";
import InlineBiblePlugin from "../../main";
import { FootnotePopover } from "../FootnotePreview/FootnotePopover";
import noteStyles from "../notes/addNoteClass.module.css";

export class BibleVersesWidget extends WidgetType {
	private plugin: InlineBiblePlugin;
	private markdownContent: string;
	private filePath: string;

	constructor({markdownContent, plugin, filePath}: {markdownContent: string, plugin: InlineBiblePlugin, filePath: string}){
		super();
		this.markdownContent = markdownContent;
		this.plugin = plugin;
		this.filePath = filePath;
	}

	eq(widget: BibleVersesWidget): boolean {
		return widget.markdownContent === this.markdownContent && widget.filePath === this.filePath;
	}

	toDOM() {
		const container = document.createElement("div");
		container.classList.add(styles.widget);
		container.classList.add(noteStyles.bibleChapter);
		container.classList.add("markdown-rendered");
		container.addEventListener("click", (e) => {
			if (e.target instanceof HTMLAnchorElement){
				return;
			}

			// TODO scroll to position
			this.plugin.app.workspace.openLinkText(this.filePath, "", e.altKey || e.metaKey)
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
			})
		});
		return container;
	}
}
