/* eslint no-console: off,  @typescript-eslint/no-empty-function:off */
import { assert, it, when } from '../index.js';

when('diff', () => {
	it('should show diffs in json', () => {
		assert.equal({ first: 3, second: [1, 2, 3] }, {
			fir2st: 4,
			second: [3, 2, 1]
		});
	});

	it('should show string diffs', () => {
		assert.equal('asdfghjk', 'asdftyghj');
	});
});
