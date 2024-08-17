export function getFilePath(baseFolder: string, chapter: string){
	const bookParts = chapter.split(' ');
	bookParts.pop();
	const book = bookParts.join(' ');
	return `${baseFolder}/${book}/${chapter}.md`;
}
