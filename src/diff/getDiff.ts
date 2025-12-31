import displayValue from 'display-value';
import sortKeys from 'sort-keys';
import {
	isArray,
	isDate,
	isMap,
	isNumber,
	isObject,
	isRegExp,
	isSet,
	isString
} from 'type-enforcer';
import type { Diff } from '../hippogriff.models';
import diffNumber from './diffNumber.js';
import diffTwoLines from './diffTwoLines.js';

const isNumeric = (value: unknown): boolean => isNumber(value) ||
	value === Infinity ||
	value === -Infinity;

const isStringLike = (value: unknown): boolean => isDate(value) ||
	isString(value) ||
	isRegExp(value);

const getDiff = (
	expected: unknown,
	actual: unknown
): [Array<Diff>, Array<Diff>] => {
	if (isNumeric(expected)) {
		return diffNumber(expected as number, actual as number);
	}

	if (isStringLike(expected)) {
		return diffTwoLines(
			displayValue(expected, { beautify: true, maxCharsPerLine: 50 }),
			displayValue(actual, { beautify: true, maxCharsPerLine: 50 })
		);
	}

	if (isObject(expected) && isObject(actual)) {
		const expectedKeys = Object.keys(expected as Record<string, unknown>);
		const sortedActual = sortKeys(actual as Record<string, unknown>, {
			compare: (a, b) => {
				const aIndex = expectedKeys.indexOf(a);
				const bIndex = expectedKeys.indexOf(b);

				if (aIndex < bIndex) {
					return -1;
				}

				return aIndex > bIndex ? 1 : 0;
			}
		});

		return diffTwoLines(
			displayValue(expected, { beautify: true, maxCharsPerLine: 50 }),
			displayValue(sortedActual, { beautify: true, maxCharsPerLine: 50 })
		);
	}

	if (
		isArray(expected) ||
		isSet(expected) ||
		isMap(expected)
	) {
		return diffTwoLines(
			displayValue(expected, { beautify: true, maxCharsPerLine: 50 }),
			displayValue(actual, { beautify: true, maxCharsPerLine: 50 })
		);
	}

	return diffTwoLines(
		displayValue(expected, { beautify: true, maxCharsPerLine: 50 }),
		displayValue(actual, { beautify: true, maxCharsPerLine: 50 })
	);
};

export default getDiff;
