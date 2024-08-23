import { HoverPopover } from "obsidian";
import styles from "./footnotePopover.module.css"

export class FootnotePopover extends HoverPopover {
	private linkElement: HTMLLinkElement;

	constructor(el: HTMLLinkElement) {
		super({hoverPopover: null}, el);
		this.linkElement = el;
	}


	onload() {
		const footnoteLink = this.linkElement.href;
		const footnoteId = footnoteLink.substring(footnoteLink.indexOf("#"));

		const content = document.querySelector<HTMLElement>(`${footnoteId} > p`);
		if (content) {
			this.hoverEl.appendChild(content.cloneNode(true));
			this.hoverEl.classList.add(styles.popover);
		}
		super.onload();
	}

	onunload() {
		super.onunload();
	}
}
