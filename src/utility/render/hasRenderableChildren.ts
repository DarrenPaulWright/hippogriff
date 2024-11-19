import type { IAnyResult } from '../../hippogriff.models.js';
import type { TabTypes } from '../../parent/render/renderLine.js';
import canRender from './canRender.js';

const hasRenderableChildren = (
	result: IAnyResult,
	tree: Array<TabTypes>,
	isVerbose: boolean
): boolean => {
	return result.type === 'group' &&
		result.error === false &&
		!result.isSkipped &&
		result.results.some((child) => {
			return child.type === 'bench' ||
				canRender(child, tree, isVerbose);
		});
};

export default hasRenderableChildren;
