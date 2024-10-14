import type InlineBiblePlugin from "../../main";
import styles from "./addNoteClass.module.css";
import { getAllActiveViews } from "../helper/getAllActiveViews";

export function addNoteClass(plugin: InlineBiblePlugin) {
	const activeViews = getAllActiveViews(plugin);
	if (!activeViews) {
		return;
	}

	// Flatten groups into a single array
	const className = styles.bibleChapter;
	const {bibleLocation} = plugin.settings;

	// Remove and apply classes for each applicable view
	activeViews.forEach((view) => {
		const previewContainer = view.contentEl.querySelector(".markdown-preview-view");
		const ediContainer = view.contentEl.querySelector(".markdown-source-view");
		previewContainer?.classList.remove(className);
		ediContainer?.classList.remove(className);

		if (view.file?.path.startsWith(bibleLocation)) {
			previewContainer?.classList.add(className);
			ediContainer?.classList.add(className);
		}
	});
}
