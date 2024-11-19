import { assert, it } from '../../../index.js';
import remainingSamples from './remainingSamples.js';

it('should return 200 for an empty array', () => {
	assert.is(remainingSamples([], 1, 100, 200, 0), 100);
});

it('should return 0 if the mean is 200', () => {
	assert.is(remainingSamples([200], 1, 100, 200, 200), 0);
});

it('should return 0 if the mean is 33', () => {
	assert.is(remainingSamples([82], 2, 100, 200, 118), 1);
});

// it('should return 0 if the mean is 33', () => {
// 	assert.is(remainingSamples([100], 1, 100, 200, 100), 1);
// });
