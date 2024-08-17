import styles from "./widget.module.css";
import { WidgetType } from "@codemirror/view";
import { MarkdownRenderer } from "obsidian";
import InlineBiblePlugin from "../../main";

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
		container.classList.add("bible-chapter");
		container.classList.add("markdown-rendered");
		container.addEventListener("click", (e) => {
			console.log("Target", e.target);
			if (e.target instanceof HTMLAnchorElement){
				return;
			}

			// TODO scroll to position
			this.plugin.app.workspace.openLinkText(this.filePath, "", e.altKey || e.metaKey)
		})


		MarkdownRenderer.render(this.plugin.app, this.markdownContent, container, this.filePath, this.plugin);
		return container;
	}
}
