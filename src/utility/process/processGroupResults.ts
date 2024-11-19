import type { IAnyResult, IDescribe, IGroupResult } from '../../hippogriff.models.js';

const reduceErrors = (
	results: Readonly<Array<IAnyResult>>,
	isSkipped: boolean
): number => {
	return isSkipped ?
		0 :
		results.reduce<number>((errors, result) => {
			let output = errors;

			if (result.error !== false) {
				output++;
			}
			else if (result.type === 'group') {
				output += result.summary.failCount;
			}

			return output;
		}, 0);
};

const reduceSkipped = (results: Readonly<Array<IAnyResult>>): number => {
	return results.reduce<number>((sum, result) => {
		if (result.type === 'group') {
			return sum + result.summary.skipCount;
		}

		if (result.isSkipped) {
			return sum + 1;
		}

		return sum;
	}, 0);
};

const reduceDurations = (
	results: Readonly<Array<IAnyResult>>,
	isSkipped: boolean,
	isPassing: boolean
): Array<number> => {
	const target = isPassing ? 'passingDurations' : 'errorsDurations';

	return isSkipped ?
		[] :
		results.reduce<Array<number>>((durations, result) => {
			if (result.type === 'group') {
				durations.push(...result.summary[target]);
			}
			else if (
				result.type === 'test' &&
				!result.isSkipped &&
				((isPassing && !result.error) || (!isPassing && result.error))
			) {
				durations.push(result.duration);
			}

			return durations;
		}, []);
};

const processGroupResults = (
	group: Readonly<Pick<IDescribe, 'title' | 'settings'>>,
	results: Readonly<Array<IAnyResult>>,
	isSkipped: boolean,
	logs: IGroupResult['logs'],
	error: Error | false = false
): IGroupResult => {
	const passingDurations = reduceDurations(results, isSkipped, true);
	const failCount = reduceErrors(results, isSkipped);

	return {
		type: 'group',
		title: group.title,
		results,
		error,
		isSkipped,
		summary: {
			passCount: error ? 0 : passingDurations.length,
			failCount: error ? 0 : failCount,
			skipCount: error ? 0 : reduceSkipped(results),
			passingDurations,
			errorsDurations: reduceDurations(results, isSkipped, false)
		},
		settings: group.settings,
		logs
	};
};

export default processGroupResults;
