import { boxChart } from 'char-charts';
import { GROUP_ICON } from '../../constants.js';
import type { IAnyResult, IGroupResult } from '../../hippogriff.models';
import canRender from '../../utility/render/canRender.js';
import hasRenderableChildren from '../../utility/render/hasRenderableChildren.js';
import lastRenderableIndex from '../../utility/render/lastRenderableIndex.js';
import renderError from './renderError.js';
import renderLine, { extendTree, type TabTypes } from './renderLine.js';
import renderLogs from './renderLogs.js';
import renderTitle from './renderTitle.js';

let isVerboseLocal = false;

const renderTestOrGroup = (
	result: IAnyResult,
	tree: Array<TabTypes>
): void => {
	if (canRender(result, tree, isVerboseLocal)) {
		const hasChildren = hasRenderableChildren(result, tree, isVerboseLocal);
		const extendedTree = extendTree(tree, hasChildren ? 'extend' : 'blank');

		renderLine(renderTitle(result), tree);
		renderLogs(result).forEach((line) => {
			renderLine(line, extendedTree);
		});
		renderError(result.error).forEach((line) => {
			renderLine(line, extendedTree);
		});
	}
};

const canRenderBenchChart = (
	result: IGroupResult,
	chartData: Array<{ data: Array<number>; label: string; group: Array<string> }>,
	tree: Array<TabTypes>
): boolean => {
	return (tree.length === 0 || Boolean(result.settings.benchDistinctCharts)) &&
		chartData.some((item) => item.data.length !== 0);
};

const renderBenchChart = (
	result: IGroupResult,
	data: Array<{ data: Array<number>; label: string; group: Array<string> }>,
	title: Array<string>
): void => {
	renderLine();

	boxChart({
		title: title.join(GROUP_ICON),
		data: data.map((item) => ({
			...item,
			group: item.group.slice(title.length)
		})),
		render: {
			width: process.stdout.columns - 1,
			significantDigits: 3,
			maxYAxisWidth: Math.min(100, Math.floor(process.stdout.columns / 3)),
			showInlineLabels: true,
			showDots: isVerboseLocal,
			colors: result.settings.benchColors,
			extraRowSpacing: true
		},
		xAxis: result.settings.benchDuration ?
			{
				scale: 'linear',
				suffix: 's',
				label: 'Duration'
			} :
			{
				scale: 'log',
				label: 'Ops/sec'
			}
	}).forEach((line) => {
		renderLine([['raw', line]]);
	});

	renderLine();

	renderLogs(result)
		.forEach((line) => {
			renderLine(line);
		});
};

const processAny = (
	result: IAnyResult,
	chartData: Array<{ data: Array<number>; label: string; group: Array<string> }>,
	benchGroup: Array<string>,
	tree: Array<TabTypes>
): void => {
	if (result.type === 'bench') {
		if (!result.isSkipped) {
			chartData.push({
				data: result.settings.benchDuration ?
					result.samples :
					result.samples.map((value) => 1000 / value),
				label: result.title,
				group: benchGroup
			});

			if (result.error) {
				renderTestOrGroup(result, tree);
			}
		}
	}
	else {
		renderTestOrGroup(result, tree);
	}

	if (result.type === 'group') {
		const childGroup = [...benchGroup, result.title];

		if (hasRenderableChildren(result, tree, isVerboseLocal)) {
			const lastRenderedIndex = lastRenderableIndex(result.results, tree, isVerboseLocal);

			result.results.forEach((child, index) => {
				processAny(
					child,
					chartData,
					childGroup,
					extendTree(tree, index === lastRenderedIndex ? 'final' : 'branch')
				);
			});
		}

		if (canRenderBenchChart(result, chartData, tree)) {
			renderBenchChart(result, chartData, childGroup);
			chartData.length = 0;
		}
	}
};

const renderResult = (result: IGroupResult, isVerbose: boolean): IGroupResult => {
	isVerboseLocal = isVerbose;

	processAny(result, [], [], []);

	if (isVerbose) {
		renderLine();
	}

	return result;
};

export default renderResult;
