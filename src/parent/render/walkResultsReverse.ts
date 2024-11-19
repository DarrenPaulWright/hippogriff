import type { IAnyResult } from '../../hippogriff.models';

const walkResultsReverse = (
	data: IAnyResult,
	callback: (
		result: IAnyResult,
		parent: IAnyResult | undefined
	) => boolean | undefined
): boolean => {
	const walk = (
		child: IAnyResult,
		parent?: IAnyResult
	): boolean => {
		return (child.type === 'group' && child.results.some((result) => walk(result, child))) ||
			callback(child, parent) === true;
	};

	return walk(data);
};

export default walkResultsReverse;
