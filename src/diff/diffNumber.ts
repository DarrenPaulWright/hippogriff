import displayValue from 'display-value';
import type { Diff } from '../hippogriff.models';
import diffTwoLines from './diffTwoLines.js';

const decimalIndex = (value: string): number => {
	const index = value.indexOf('.');

	return index === -1 ? value.length : index;
};

const diffNumber = (
	expected: number,
	actual: number
): [Array<Diff>, Array<Diff>] => {
	const expectedOut = displayValue(expected);
	const actualOut = displayValue(actual);
	const output = diffTwoLines(expectedOut, actualOut);
	const expectedDecimalIndex = decimalIndex(expectedOut);
	const actualDecimalIndex = decimalIndex(actualOut);

	if (expectedDecimalIndex < actualDecimalIndex) {
		output[0].unshift([
			'removedRow',
			' '.repeat(actualDecimalIndex - expectedDecimalIndex)
		]);
	}
	else if (expectedDecimalIndex > actualDecimalIndex) {
		output[1].unshift([
			'addedRow',
			' '.repeat(expectedDecimalIndex - actualDecimalIndex)
		]);
	}

	return output;
};

export default diffNumber;
