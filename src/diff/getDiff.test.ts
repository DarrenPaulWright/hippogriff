import { assert, it } from '../../index.js';
import getDiff from './getDiff.js';

it('should diff numbers', () => {
	const result = getDiff(112.2, 1.956);
	assert.equal([[
		['removedRow', '1'],
		['removed', '12'],
		['removedRow', '.'],
		['removed', '2']
	], [
		['addedRow', '  '],
		['addedRow', '1'],
		['addedRow', '.'],
		['added', '956']
	]], result);
});
