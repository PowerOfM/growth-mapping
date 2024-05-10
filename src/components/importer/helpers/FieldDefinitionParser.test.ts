import { describe, expect, it } from 'vitest';
import { FieldDefinitionParser, type IFieldInputDefinition } from './FieldDefinitionParser';

describe(FieldDefinitionParser.name, () => {
	const headers = ['ColA', 'ColB', 'ColC', 'ColD', 'ColE'];

	it('should parse non-complex inputs', () => {
		const input: IFieldInputDefinition = { isComplex: false, complexValue: '', columnIndex: 3 };
		expect(FieldDefinitionParser.parse(input, headers)).toEqual([input.columnIndex]);
	});

	describe('should parse complex inputs', () => {
		it('expected case', () => {
			const input: IFieldInputDefinition = {
				isComplex: true,
				complexValue: 'Values: {ColC}, {ColB} or {ColE} and then {ColA}... yup'
			};
			expect(FieldDefinitionParser.parse(input, headers)).toEqual([
				'Values: ',
				2,
				', ',
				1,
				' or ',
				4,
				' and then ',
				0,
				'... yup'
			]);
		});

		it('empty', () => {
			expect(FieldDefinitionParser.parse({ isComplex: true, complexValue: '' }, headers)).toEqual(
				[]
			);
		});

		it('no headers', () => {
			expect(
				FieldDefinitionParser.parse(
					{ isComplex: true, complexValue: 'Something or other' },
					headers
				)
			).toEqual(['Something or other']);
		});

		it('no gaps', () => {
			expect(
				FieldDefinitionParser.parse(
					{ isComplex: true, complexValue: '{ColA}{ColB}{ColC}' },
					headers
				)
			).toEqual([0, 1, 2]);
		});
	});

	it('should return null if a header is invalid', () => {
		expect(
			FieldDefinitionParser.parse(
				{ isComplex: true, complexValue: '{ColA} Test {Unknown}' },
				headers
			)
		).toBeNull();
	});

	it('should return null if a } is missing', () => {
		expect(
			FieldDefinitionParser.parse({ isComplex: true, complexValue: '{ColA Test {ColB}' }, headers)
		).toBeNull();
	});
});
