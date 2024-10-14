import type InlineBiblePlugin from "../../main";
import { MarkdownView } from "obsidian";

export function getAllActiveViews(plugin: InlineBiblePlugin): MarkdownView[] | null {
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
