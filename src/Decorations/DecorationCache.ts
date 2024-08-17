import { Decoration } from "@codemirror/view";
import { ParseResultType } from "../ParseResultType";
import { BibleVersesWidget } from "./BibleVersesWidget";
import { buildMarkdown } from "../buildMarkdown";
import InlineBiblePlugin from "../../main";
import { getFilePath } from "../helper/getFilePath";

export class DecorationCache {
	static instance: DecorationCache;

	private decorations: Record<string, undefined|Promise<Decoration>> = {};
	private chapterDecorationLookup: Record<string, Set<string>|undefined> = {};
	private plugin: InlineBiblePlugin;

	static init(plugin: InlineBiblePlugin) {
		this.instance = new DecorationCache(plugin);
	}

	private constructor(plugin: InlineBiblePlugin) {
		this.plugin = plugin;
		plugin.app.vault.on("modify", (file) => {
			this.invalidate(file.path);
		});
		plugin.app.vault.on("delete", (file) => {
			this.invalidate(file.path);
		});
		plugin.app.vault.on("rename", (_, oldPath) => {
			this.invalidate(oldPath);
		});
	}

	getDecoration(reference: ParseResultType) {
		let decoration = this.decorations[reference.bibleReference];
		if (!decoration) {
			decoration = buildMarkdown(this.plugin, reference, false).then(({
																										   versesContent,
																										   filePath
																									   }) => Decoration.replace({
				widget: new BibleVersesWidget({markdownContent: versesContent, plugin: this.plugin, filePath}),
				inclusive: false
			}));
			this.decorations[reference.bibleReference] = decoration;
		}

		const filePath = getFilePath(this.plugin.settings.bibleLocation, reference.chapter);
		let lookupSet = this.chapterDecorationLookup[filePath];
		if (!lookupSet) {
			lookupSet = new Set();
			this.chapterDecorationLookup[filePath] = lookupSet;
		}
		lookupSet.add(reference.bibleReference);

		return decoration;
	}

	invalidate(path: string){
		const set = this.chapterDecorationLookup[path];
		if (!set){
			return;
		}
		set.forEach((reference) => {
			this.decorations[reference] = undefined;
		});
		delete this.chapterDecorationLookup[path];
	}
}
