import {
	FAIL_ICON,
	GROUP_ICON,
	MEAN_ICON,
	MEDIAN_ICON,
	PASS_ICON,
	SEPARATOR,
	SKIP_ICON,
	SUM_ICON
} from '../../constants.js';
import type { IAnyResult, IGroupResult, RenderLineStructure } from '../../hippogriff.models';
import median from '../../utility/math/median.js';
import sum from '../../utility/math/sum.js';
import type colorize from '../colorize.js';
import readableTime from './readableTime.js';

const getExtendedStats = (data: IGroupResult): Array<string> => {
	const stats: Array<string> = [];

	const measurableTests = data.summary.passCount + data.summary.failCount;
	const passingDuration = sum(data.summary.passingDurations);
	const totalDuration = passingDuration + sum(data.summary.errorsDurations);
	const showPassingStats = data.summary.failCount !== 0 && data.summary.passCount !== 0;

	stats.push(`${ SUM_ICON }: ${ readableTime(
		sum(data.summary.passingDurations) + sum(data.summary.errorsDurations)
	) }`);

	if (measurableTests > 1) {
		if (showPassingStats) {
			stats.push(`${ SUM_ICON } passing: ${ readableTime(passingDuration) }`);
		}

		stats.push(`${ MEAN_ICON }: ${
			readableTime(totalDuration / measurableTests)
		}`);

		if (showPassingStats) {
			stats.push(
				`${ MEAN_ICON } passing: ${ readableTime(passingDuration / data.summary.passCount) }`,
				`${ MEDIAN_ICON } passing: ${ readableTime(median(data.summary.passingDurations)) }`
			);
		}
		else {
			stats.push(`${ MEDIAN_ICON }: ${ readableTime(median(data.summary.passingDurations)) }`);
		}
	}

	return stats;
};

const getGroupStats = (data: IGroupResult): Array<RenderLineStructure> => {
	const statsSummary: Array<RenderLineStructure> = [];
	const totalTests = data.summary.passCount + data.summary.failCount + data.summary.skipCount;

	if (totalTests !== 0) {
		statsSummary.push([
			'count',
			`  ${ totalTests.toLocaleString() } test${ totalTests === 1 ? '' : 's' }`
		]);

		if (
			data.title === 'hippogriffSummary' ||
			data.summary.failCount || data.summary.skipCount
		) {
			statsSummary.push(
				['count', SEPARATOR],
				['pass', `pass: ${ data.summary.passCount.toLocaleString() }`]
			);

			if (data.summary.failCount) {
				statsSummary.push(
					['count', SEPARATOR],
					['fail', `fail: ${ data.summary.failCount.toLocaleString() }`]
				);
			}

			if (data.summary.skipCount) {
				statsSummary.push(
					['count', SEPARATOR],
					['skip', `skip: ${ data.summary.skipCount.toLocaleString() }`]
				);
			}
		}

		statsSummary.push(
			['stats', `${ SEPARATOR }${ getExtendedStats(data).join(SEPARATOR) }`]
		);
	}

	return statsSummary;
};

const getStats = (data: IAnyResult): Array<RenderLineStructure> => {
	if (data.type === 'test') {
		return [[
			'stats',
			`  ${ readableTime(data.duration) }`
		]];
	}
	else if (data.type === 'group') {
		return getGroupStats(data);
	}

	return [];
};

const getIcon = (isFail: boolean, isTest: boolean): string => {
	return isFail ?
		(isTest ? FAIL_ICON : GROUP_ICON) :
		(isTest ? PASS_ICON : GROUP_ICON);
};

const getRowType = (isFail: boolean, isTest: boolean): keyof typeof colorize => {
	return isFail ?
		(isTest ? 'fail' : 'failGroup') :
		(isTest ? 'pass' : 'passGroup');
};

const renderTitle = (data: IAnyResult): Array<RenderLineStructure> => {
	const isTest = data.type !== 'group';

	if (data.isSkipped) {
		return [['skip',
			`${ isTest ? SKIP_ICON : GROUP_ICON }${ data.title } SKIPPED`]];
	}

	const isFail = (data.type === 'group' && data.summary.failCount !== 0) ||
		data.error !== false;

	const rowType = getRowType(isFail, isTest);

	return [
		[rowType, getIcon(isFail, isTest)],
		[rowType, data.title],
		...getStats(data)
	];
};

export default renderTitle;
