/* eslint no-console:off */
import stripAnsi from 'strip-ansi';
import { isString } from 'type-enforcer';
import { GROUP_ICON } from '../../constants.js';
import type { Color, RenderLineStructure } from '../../hippogriff.models';
import colorize from '../colorize.js';

export type TabTypes = 'blank' | 'extend' | 'branch' | 'final' | 'group' | 'empty';

const tabs: Record<TabTypes, string> = {
	blank: '   ',
	extend: ' │ ',
	branch: ' ├─',
	final: ' ╰─',
	group: ' '.repeat(GROUP_ICON.length),
	empty: ''
};

export const extendTree = (
	tree: Array<TabTypes>,
	newBranch: TabTypes
): Array<TabTypes> => {
	return [
		...tree.map((tab) => {
			if (tab === 'final') {
				return 'blank';
			}

			if (tab === 'branch') {
				return 'extend';
			}

			return tab;
		}),
		newBranch
	];
};

const titleColors: Array<Color> = ['skip', 'pass', 'fail', 'passGroup', 'failGroup'];
const groupColors: Array<Color> = ['passGroup', 'failGroup'];

const renderLine = (
	structure: Array<RenderLineStructure> = [],
	tree: Array<TabTypes> = []
): void => {
	const columns = process.stdout.columns ?? 50;
	const isTitle = titleColors.includes(structure[0]?.[0]);
	const isGroup = groupColors.includes(structure[0]?.[0]);

	const indentText = colorize.tree(tree.map((tab) => tabs[tab]).join(''));
	const wrapIndentText = colorize.tree(
		extendTree(tree, isTitle ? (isGroup ? 'extend' : 'group') : 'empty')
			.map((tab) => tabs[tab])
			.join('')
	);

	let output = '';

	let runningIndex = 0;
	let remainingLength = 0;

	const append = (text: string, color?: Color): void => {
		// try {
		if (color === 'raw' && !isString(text)) {
			console.log(indentText, text);
		}
		else {
			output += color ? colorize[color](text) : text;
		}

		// }
		// catch (error) {
		// 	console.log('error:', error);
		// }

		runningIndex += text.length;
		remainingLength = columns - runningIndex;
	};

	const wrap = (line: string, color: Color, isNewLine: boolean): void => {
		if (isNewLine) {
			output += '\n';
			runningIndex = 0;
			append(wrapIndentText);
		}

		if (line.length < remainingLength) {
			append(line, color);
		}
		else {
			let splitIndex = line.lastIndexOf(' ', remainingLength);

			if (splitIndex === -1) {
				splitIndex = remainingLength;
			}

			append(line.slice(0, splitIndex), color);
			wrap(line.slice(splitIndex + 1), color, true);
		}
	};

	append(indentText);

	structure.forEach(([color, data]) => {
		const lines = (typeof data === 'number' ?
			data.toLocaleString() :
			data ?? '')
			.split('\n');

		lines.forEach((line, linesIndex) => {
			if (line) {
				if (color === 'raw') {
					append(line, color);
				}
				else {
					wrap(stripAnsi(line), color, linesIndex !== 0);
				}
			}
		});
	});

	console.log(output);
};

export default renderLine;
