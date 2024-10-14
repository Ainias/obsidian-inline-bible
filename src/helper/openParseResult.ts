import InlineBiblePlugin from "../../main";
import { getFilePath } from "./getFilePath";
import { ParseResultType } from "../ParseResultType";

export function openParseResult(plugin: InlineBiblePlugin, parseResult: ParseResultType, e: MouseEvent) {
	const filePath = getFilePath(plugin.settings.bibleLocation, parseResult.chapter)

	plugin.app.workspace.openLinkText(filePath, "", e.altKey || e.metaKey)
}
