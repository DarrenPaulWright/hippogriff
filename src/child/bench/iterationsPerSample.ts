import mean from '../../utility/math/mean.js';

export const ITERATION_MODIFIER = 2;

export default (samples: Array<number>): number => {
	return Math.ceil(ITERATION_MODIFIER / (mean(samples.slice(-3)) || 1));
};
