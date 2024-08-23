import "src/basic.css";
import {
	MarkdownView,
	Plugin,
} from 'obsidian';
import { InlineBibleSettingTab } from "./src/SettingsTab";
import { parseText } from "./src/parseText";
import { decorationsStateField } from "./src/Decorations/decorationsStateField";
import { getDecorationViewPlugin } from "./src/Decorations/getDecorationViewPlugin";
import { buildMarkdown } from "./src/buildMarkdown";
import { BibleVersesWidget } from "./src/Decorations/BibleVersesWidget";
import { DecorationCache } from "./src/Decorations/DecorationCache";
import { addNoteClass } from "./src/notes/addNoteClass";

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	prefix: string;
	bibleLocation: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	prefix: '@',
	bibleLocation: "bible"
}

function escapeRegex(val: string) {
	return val.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

export default class InlineBiblePlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		DecorationCache.init(this);

		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new InlineBibleSettingTab(this.app, this));

		// Editor View
		this.registerEditorExtension([getDecorationViewPlugin(this), decorationsStateField])

		// Reading View
		this.registerMarkdownPostProcessor(async (el, ctx) => {
			let lastId = 0;
			// Reverse so we can replace from the end and the indexes don't change
			const results = parseText(el.innerHTML, this.settings.prefix).reverse();

			let html = el.innerHTML;
			for (let i = 0; i < results.length; i++) {
				const id = `bible-inline-replace-${lastId}`;

				const result = results[i];
				const startString = html.substring(0, result.startIndex);
				const endString = html.substring(result.endIndex);
				html = startString + `<span id="${id}">${result.bibleReference}</span>` + endString;
				buildMarkdown(this, result).then(({filePath, versesContent}) => {
					const markdownElement = new BibleVersesWidget({
						markdownContent: versesContent,
						plugin: this,
						filePath
					}).toDOM();
					el.querySelector(`#${id}`)?.replaceWith(markdownElement);
				});
			}
			el.innerHTML = html;
		});

		this.registerEvent(this.app.workspace.on('layout-change', () => addNoteClass(this)))
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

