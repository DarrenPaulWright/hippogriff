import { assert } from 'type-enforcer';
import { it } from '../../../index.js';
import mean from './mean.js';

it('should return 0 for an empty array', () => {
	assert.equal(mean([]), 0);
});

it('should the one value if there is only one value in an array', () => {
	assert.equal(mean([11]), 11);
});

it('should find the mean of the values in an array', () => {
	assert.equal(mean([0, 1, 23, 42]), 16.5);
});
