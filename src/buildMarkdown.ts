import { ParseResultType } from "./ParseResultType";
import { Vault } from "obsidian";
import InlineBiblePlugin from "../main";
import path from "path";

export async function buildMarkdown(plugin: InlineBiblePlugin, parseResult: ParseResultType){
	const chapterFile = plugin.app.vault.getFileByPath(path.join(plugin.settings.bibleLocation, parseResult.book, parseResult.chapter + ".md"));
	if (!chapterFile) {
		throw new Error(`Chapter file not found: ${parseResult.book} ${parseResult.chapter}`);
	}

	const content = await plugin.app.vault.cachedRead(chapterFile)
	let versesContent = `[[${chapterFile.path}|${parseResult.bibleReference}]]\n`;

	const lines = content.split("\n");
	for (const line of lines) {
		const endIndex = line.indexOf(']');
		const verseNumber = Number(line.substring(1, endIndex));
		if (endIndex !== -1 && verseNumber >= parseResult.verses.start && verseNumber <= parseResult.verses.end) {
			const content = line.substring(endIndex + 1);
			versesContent += `<sup>${verseNumber}</sup>${content}\n`;
		} else if (verseNumber > parseResult.verses.end) {
			break;
		}
	}
	return {versesContent, filePath: chapterFile.path};
}
