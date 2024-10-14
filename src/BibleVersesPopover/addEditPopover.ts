import { getAllActiveViews } from "src/helper/getAllActiveViews";
import type InlineBiblePlugin from "../../main";
import styles from "./bibleVersesPopover.module.css";
import { FootnotePopover } from "../FootnotePreview/FootnotePopover";
import { BibleVersesPopover } from "./BibleVersesPopover";
import { openParseResult } from "../helper/openParseResult";
import { ParseResultType } from "../ParseResultType";

const className = "oib-has-hover-listener";

export function addEditPopover(plugin: InlineBiblePlugin) {
	const activeViews = getAllActiveViews(plugin);
	if (!activeViews) {
		return;
	}

	// Remove and apply classes for each applicable view
	activeViews.forEach((view) => {
		const editContainer = view.contentEl.querySelector(".markdown-source-view");
		if (!editContainer || editContainer.classList.contains(className)) {
			return;
		}

		editContainer.classList.add(className);
		editContainer.addEventListener("mouseover", (event) => {
			if (event.target instanceof HTMLElement && event.target.classList.contains(styles.popoverLink)){
				const parseResult = event.target.getAttribute("data-parse-result");
				if (!parseResult) {
					return;
				}
				const parseResultObject: ParseResultType = JSON.parse(parseResult);
				if (!parseResultObject.collapsed && !parseResultObject.linkOnly){
					return;
				}

				new BibleVersesPopover(event.target, {plugin, parseResult: parseResultObject, withMargin: true});
			}
		});
		editContainer.addEventListener("click", (event) => {
			const mouseEvent = event as MouseEvent;
			if (event.target instanceof HTMLElement && event.target.classList.contains(styles.popoverLink) && !mouseEvent.shiftKey){
				const parseResult = event.target.getAttribute("data-parse-result");
				if (!parseResult) {
					return;
				}
				const parseResultObject = JSON.parse(parseResult);
				openParseResult(plugin, parseResultObject, mouseEvent);
			}
		}, {capture: true});
	});
}
