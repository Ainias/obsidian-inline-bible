import {
	MarkdownRenderer,
	Plugin,
} from 'obsidian';
import { InlineBibleSettingTab } from "./src/SettingsTab";
import path from 'path';
import { parseText } from "./src/parseText";
import { decorationsStateField } from "./src/Decorations/decorationsStateField";
import { getDecorationViewPlugin } from "./src/Decorations/getDecorationViewPlugin";
import { buildMarkdown } from "./src/buildMarkdown";
import { BibleVersesWidget } from "./src/Decorations/BibleVersesWidget";

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
					const markdownElement = new BibleVersesWidget({markdownContent: versesContent, plugin: this, filePath}).toDOM();
					el.querySelector(`#${id}`)?.replaceWith(markdownElement);
				});
			}
			el.innerHTML = html;

			// el.innerHTML = el.innerHTML.replaceAll(replaceRegex, (_, match) => {
			// 	const [chapterName, verses] = match.split(',');
			// 	const bookParts = chapterName.split(' ');
			// 	bookParts.pop();
			// 	const book = bookParts.join(' ');
			//
			// 	const chapterFile = this.app.vault.getFileByPath(path.join(this.settings.bibleLocation, book, chapterName + ".md"));
			// 	if (!chapterFile) {
			// 		return match;
			// 	}
			//
			// 	lastId++;
			// 	const id = `bible-inline-replace-${lastId}`;
			// 	const chapterContentPromise = this.app.vault.cachedRead(chapterFile).then(content => {
			//
			// 		let versesContent = `[[${chapterFile.path}|${match}]]\n`;
			// 		let verseParts = [0, Infinity];
			// 		if (verses) {
			// 			verseParts = verses.split('-').map(Number);
			// 			if (verseParts.length === 1) {
			// 				verseParts.push(verseParts[0]);
			// 			}
			// 		}
			//
			// 		const lines = content.split("\n");
			// 		for (const line of lines) {
			// 			const endIndex = line.indexOf(']');
			// 			const verseNumber = Number(line.substring(1, endIndex));
			// 			if (verseNumber >= verseParts[0] && verseNumber <= verseParts[1]) {
			// 				const content = line.substring(endIndex + 1);
			// 				versesContent += `<sup>${verseNumber}</sup>${content}\n`;
			// 			} else if (verseNumber > verseParts[1]) {
			// 				break;
			// 			}
			// 		}
			//
			// 		const element = el.querySelector(`#${id}`);
			// 		if (element instanceof HTMLElement) {
			// 			MarkdownRenderer.render(this.app, versesContent, element, chapterFile.path, this).then(() => {
			// 				element.querySelector(".loading-indicator")?.remove();
			// 			});
			// 		}
			// 	});
			// 	return `<div id='${id}'><span class="loading-indicator">Loading...</span></div>`;
			// });
		})
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

