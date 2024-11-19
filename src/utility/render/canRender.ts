import type { IAnyResult } from '../../hippogriff.models.js';
import type { TabTypes } from '../../parent/render/renderLine.js';

const canRender = (
	result: IAnyResult,
	tree: Array<TabTypes>,
	isVerbose: boolean
): boolean => {
	return (
		tree.length === 0 ||
		result.error !== false ||
		(result.type === 'group' && result.summary.failCount !== 0) ||
		(isVerbose && result.type !== 'bench')
	);
};

export default canRender;
