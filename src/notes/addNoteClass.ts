import type InlineBiblePlugin from "../../main";
import { MarkdownView } from "obsidian";
import styles from "./addNoteClass.module.css";

function getAllActiveViews(plugin: InlineBiblePlugin): MarkdownView[] | null {
	const activeView = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	if (activeView) {
		// Get any linked views
		let activeViews: MarkdownView[] = [activeView];
		const leafGroup = plugin.app.workspace.getGroupLeaves((activeView.leaf as any).group);
		if (leafGroup && leafGroup.length > 0) {
			activeViews = leafGroup
				.map((leaf) => leaf.view)
				.filter((view) => view instanceof MarkdownView) as MarkdownView[];
		}
		return activeViews;
	}
	return null;
}

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
		console.log("LOG-d removing class from view", view.file?.path);
		previewContainer?.classList.remove(className);
		ediContainer?.classList.remove(className);

		if (view.file?.path.startsWith(bibleLocation)) {
			console.log("LOG-d adding class to view", view.file?.path);
			previewContainer?.classList.add(className);
			ediContainer?.classList.add(className);
		}
	});
}
