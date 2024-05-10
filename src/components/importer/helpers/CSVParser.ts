import Papa from 'papaparse';
import type { ParseResult, ParseStepResult } from 'papaparse';

export interface ICSVParserConfig {
	delimiter: string;
	newLine: string;
	quoteChar: string;
	escapeChar: string;
	header: boolean;
	dynamicTyping: boolean;
	worker: boolean;
	step?: (results: ParseStepResult<unknown>) => void;
}

export type CVSParseResult = ParseResult<string[]>;

const DEFAULT_PARSE_CONFIG: Partial<ICSVParserConfig> = {
	// delimiter: '', // auto-detect
	// newLine: '', // auto-detect
	// quoteChar: '"',
	// escapeChar: '"',
	// header: true, // the first row of parsed data will be interpreted as field names
	// dynamicTyping: true, // numeric and boolean data will be converted to their type instead of remaining strings
	// worker: false
};

export class CSVParser {
	public static parse(
		file: File,
		config: Partial<ICSVParserConfig> = {}
	): Promise<ParseResult<string[]>> {
		return new Promise((resolve, reject) => {
			Papa.parse<string[]>(file, {
				...DEFAULT_PARSE_CONFIG,
				...config,
				complete: resolve,
				error: reject
			});
		});
	}
}
