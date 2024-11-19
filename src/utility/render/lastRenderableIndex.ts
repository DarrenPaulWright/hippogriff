import type { IAnyResult } from '../../hippogriff.models.js';
import type { TabTypes } from '../../parent/render/renderLine.js';
import canRender from './canRender.js';

const lastRenderableIndex = (
	results: Readonly<Array<IAnyResult>>,
	tree: Array<TabTypes>,
	isVerbose: boolean
): number => {
	for (let index = results.length - 1; index !== -1; --index) {
		if (canRender(results[index], tree, isVerbose)) {
			return index;
		}
	}

	return -1;
};

export default lastRenderableIndex;
