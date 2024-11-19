import { assert } from 'type-enforcer';
import { it } from '../../../index.js';
import sum from './sum.js';

it('should return 0 for an empty array', () => {
	assert.equal(sum([]), 0);
});

it('should sum the values in an array', () => {
	assert.equal(sum([0, 1, 23, 42]), 66);
});

it('should sum the values in a collection', () => {
	assert.equal(sum([
		{ value: 0 },
		{ value: 1 },
		{ value: 23 },
		{ value: 42 },
		{ item: 10 }
	], 'value'), 66);
});
