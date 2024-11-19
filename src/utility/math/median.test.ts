import { assert } from 'type-enforcer';
import { it } from '../../../index.js';
import median from './median.js';

it('should return 0 for an empty array', () => {
	assert.equal(median([]), 0);
});

it('should return mean of two mid values if length is even', () => {
	assert.equal(median([0, 1, 2, 3]), 1.5);
});

it('should return the mid value if length is odd', () => {
	assert.equal(median([0, 1, 2, 3, 4, 5, 6]), 3);
});
