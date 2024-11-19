import type { IGroupResult } from '../../hippogriff.models.js';
import appendTitle from '../render/appendTitle.js';

const consolidateResults = (results: IGroupResult): IGroupResult => {
	if (results.results.length === 1 && results.results[0].type === 'group') {
		const result = consolidateResults(results.results[0]);

		result.title = appendTitle(results.title, result.title);

		result.logs = [
			...results.logs,
			...result.logs
		];

		return result;
	}

	results.results = results.results.map((child) => {
		if (child.type === 'group') {
			return consolidateResults(child);
		}

		return child;
	});

	return results;
};

export default consolidateResults;
