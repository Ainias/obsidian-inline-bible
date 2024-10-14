import { HoverPopover } from "obsidian";
import { buildMarkdown } from "../buildMarkdown";
import { ParseResultType } from "../ParseResultType";
import InlineBiblePlugin from "../../main";
import { BibleVersesWidget } from "../Decorations/BibleVersesWidget";
import styles from "./bibleVersesPopover.module.css"

export class BibleVersesPopover extends HoverPopover {
	private linkElement: HTMLElement;
	private parseResult: ParseResultType;
	private plugin: InlineBiblePlugin;
	private withMargin: boolean;

	constructor(el: HTMLElement, {parseResult, plugin, withMargin = false}: {
		parseResult: ParseResultType,
		plugin: InlineBiblePlugin
		withMargin?: boolean
	}) {
		super({hoverPopover: null}, el);
		this.linkElement = el;
		this.parseResult = parseResult;
		this.plugin = plugin;
		this.withMargin = withMargin;
	}

	onload() {
		this.hoverEl.classList.add(styles.popover);
		if (this.withMargin){
			this.hoverEl.classList.add(styles.withMargin);
		}
		buildMarkdown(this.plugin, {...this.parseResult, linkOnly: false, collapsed: false}, false).then(async ({versesContent, filePath}) => {
			const widgetElement = new BibleVersesWidget({
				markdownContent: versesContent,
				plugin: this.plugin,
				filePath,
				reference: this.parseResult,
				showReference: false
			}).toDOM();
			this.hoverEl.appendChild(widgetElement);
		});
		super.onload();
	}

	onunload() {
		super.onunload();
	}
}
