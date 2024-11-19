import stripAnsi from 'strip-ansi';
import createDiff from 'textdiff-create';
import type { Diff } from '../hippogriff.models';

const clean = (value: string): string => {
	return stripAnsi(value).replaceAll('█', '▓');
};

const diffTwoLines = (
	expected: string,
	actual: string
): [Array<Diff>, Array<Diff>] => {
	const diff = createDiff(clean(expected), clean(actual));
	let offset = 0;
	const expectedOut: Array<Diff> = [];
	const actualOut: Array<Diff> = [];

	diff.forEach((change) => {
		switch (change[0]) {
			case 0: {
				expectedOut.push([
					'removedRow',
					expected.slice(offset, offset + change[1])
				]);
				actualOut.push([
					'addedRow',
					expected.slice(offset, offset + change[1])
				]);
				offset += change[1];
				break;
			}

			case -1: {
				expectedOut.push([
					'removed',
					expected.slice(offset, offset + change[1])
				]);
				offset += change[1];
				break;
			}

			case 1: {
				actualOut.push(['added', change[1]]);
			}
		}
	});

	return [expectedOut, actualOut];
};

export default diffTwoLines;
