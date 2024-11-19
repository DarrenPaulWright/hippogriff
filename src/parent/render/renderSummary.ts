import { stackedBarChart } from 'char-charts';
import baseDescribe from '../../child/baseDescribe.js';
import type { IGroupResult, RenderLineStructure } from '../../hippogriff.models';
import processGroupResults from '../../utility/process/processGroupResults.js';
import renderTitle from './renderTitle.js';

const renderSummary = (
	results: Array<IGroupResult>,
	isVerbose: boolean
): { passed: number; errors: number; lines: Array<Array<RenderLineStructure>> } => {
	const summaryGroup = processGroupResults(baseDescribe, results, false, []);

	const passed = summaryGroup.summary.passCount;
	const errors = summaryGroup.summary.failCount;
	const skipped = summaryGroup.summary.skipCount;
	const lines: Array<Array<RenderLineStructure>> = [];

	if (!isVerbose) {
		lines.push([]);
	}

	const stats = renderTitle({
		...summaryGroup,
		title: 'hippogriffSummary'
	});

	lines.push(
		[
			['', 'Summary:'],
			...stats.slice(2)
		],
		...stackedBarChart({
			data: [{
				value: [passed, errors, skipped],
				label: ''
			}],
			render: {
				width: Math.min((process.stdout.columns ?? 52) - 2, 200),
				colors: 'passFail'
			},
			xAxis: {
				end: passed + errors + skipped
			}
		}).map<Array<RenderLineStructure>>((line) => {
			return [['raw', line]];
		}),
		[]
	);

	return { passed, errors, lines };
};

export default renderSummary;
