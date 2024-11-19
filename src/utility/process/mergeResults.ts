import type { IBenchResult, IGroupResult, ITestResult } from '../../hippogriff.models.js';
import walkResults from '../../parent/render/walkResults.js';
import walkResultsReverse from '../../parent/render/walkResultsReverse.js';
import processGroupResults from './processGroupResults.js';

const mergeResults = (
	groupsFlat: Array<IGroupResult>,
	resultsFlat: Array<Partial<ITestResult> | Partial<IBenchResult>>
): IGroupResult => {
	walkResults(groupsFlat[0], (result) => {
		if (result.type === 'group') {
			if (groupsFlat[result.settings.index]) {
				Object.assign(result, groupsFlat[result.settings.index]);
			}
		}
		else if (resultsFlat[result.settings.index]) {
			Object.assign(result, resultsFlat[result.settings.index]);
		}

		return false;
	});

	walkResultsReverse(groupsFlat[0], (result) => {
		if (result.type === 'group') {
			Object.assign(
				result,
				processGroupResults(
					{
						title: result.title,
						settings: result.settings
					},
					result.results,
					result.isSkipped,
					result.logs,
					result.error ?? false
				)
			);
		}

		return false;
	});

	return groupsFlat[0];
};

export default mergeResults;
