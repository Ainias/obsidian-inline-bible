export type ParseResultType = {
	book: string;
	chapter: string;
	verses: {
		start: number;
		end: number;
	}
	startIndex: number;
	endIndex: number
	bibleReference: string;
}
