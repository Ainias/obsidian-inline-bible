import { ParseResultType } from "./ParseResultType";
import { Vault } from "obsidian";
import InlineBiblePlugin from "../main";
import path from "path";
import { getFilePath } from "./helper/getFilePath";

export async function buildMarkdown(plugin: InlineBiblePlugin, parseResult: ParseResultType, showReference = true) {
	const chapterFile = plugin.app.vault.getFileByPath(getFilePath(plugin.settings.bibleLocation, parseResult.chapter));
	if (!chapterFile) {
		throw new Error(`Chapter file not found: ${parseResult.book} ${parseResult.chapter} ${getFilePath(plugin.settings.bibleLocation, parseResult.chapter)}`);
	}

	const content = await plugin.app.vault.cachedRead(chapterFile)
	let versesContent = showReference ? `[[${chapterFile.path}|${parseResult.bibleReference}]]\n` : ``;

	let verseNumber = -1;
	const lines = content.split("\n");
	console.log("LOG-d lines", lines)
	for (const line of lines) {
		const endIndex = line.indexOf(']');
		let isVerse = false;
		if (endIndex !== -1 && !isNaN(Number(line.substring(1, endIndex)))) {
			verseNumber = Number(line.substring(1, endIndex));
			isVerse = true;
		}

		if ((isVerse || parseResult.includeComments) && verseNumber >= parseResult.verses.start && verseNumber <= parseResult.verses.end) {
			const content = isVerse ? line.substring(endIndex + 1): line;
			if (isVerse) {
				versesContent += `<sup>${verseNumber}</sup>`;
			}
			versesContent += `${content}\n`;
		} else if (verseNumber > parseResult.verses.end) {
			break;
		}
	}
	return {versesContent, filePath: chapterFile.path};
}
