import type { IAnyResult } from '../../hippogriff.models';

const walkResults = (
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
		return callback(child, parent) === true ||
			(child.type === 'group' && child.results.some((result) => walk(result, child)));
	};

	return walk(data);
};

export default walkResults;
