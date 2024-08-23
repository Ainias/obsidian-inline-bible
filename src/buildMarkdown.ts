import { ParseResultType } from "./ParseResultType";
import InlineBiblePlugin from "../main";
import { getFilePath } from "./helper/getFilePath";

export async function buildMarkdown(plugin: InlineBiblePlugin, parseResult: ParseResultType, showReference = true) {
	const chapterFile = plugin.app.vault.getFileByPath(getFilePath(plugin.settings.bibleLocation, parseResult.chapter));

	if (!chapterFile) {
		throw new Error(`Chapter file not found: ${parseResult.book} ${parseResult.chapter} ${getFilePath(plugin.settings.bibleLocation, parseResult.chapter)}`);
	}

	const content = await plugin.app.vault.cachedRead(chapterFile)
	let versesContent = showReference ? `[[${chapterFile.path}|${parseResult.bibleReference}]]\n` : ``;
	if (parseResult.linkOnly || parseResult.collapsed) {
		return {versesContent, filePath: chapterFile.path};
	}

	const footnotes: string[] = [];
	let verseNumber = -1;
	const lines = content.split("\n");
	for (const line of lines) {
		const endIndex = line.indexOf(']');
		let isVerse = false;
		if (endIndex !== -1 && !isNaN(Number(line.substring(1, endIndex)))) {
			verseNumber = Number(line.substring(1, endIndex));
			isVerse = true;
		}

		if (verseNumber >= parseResult.verses.start) {
			const content = isVerse ? line.substring(endIndex + 1): line;
			if (content.startsWith("[^")){
				footnotes.push(content);
				continue;
			}

			if (content.startsWith("#") || content.startsWith("<span class=\"references\">") ||verseNumber > parseResult.verses.end || (!isVerse && parseResult.excludeCommentsModifier)){
				continue;
			}

			if (isVerse) {
				versesContent += `<sup>${verseNumber}</sup>`;
			}
			versesContent += `${content}\n`;
		}
	}

	return {versesContent: versesContent+"\n\n"+footnotes.join("\n"), filePath: chapterFile.path};
}
