import { assert, describe, it } from '../../../index.js';
import { testGroupResult, testTestResult } from '../../../sampleTests/testData.helper.js';
import type { IAnyResult } from '../../hippogriff.models';
import walkResults from './walkResults.js';

describe('walkResults', () => {
	it('should call the callback for one result', () => {
		let count = 0;

		const output = walkResults(testGroupResult(), () => {
			count++;

			return false;
		});

		assert.is(count, 1);
		assert.is(output, false);
	});

	it('should return true if true is returned in the callback', () => {
		let count = 0;

		const output = walkResults(testGroupResult(), () => {
			count++;

			return true;
		});

		assert.is(count, 1);
		assert.is(output, true);
	});

	it('should return true if true is returned in the callback deep', () => {
		let count = 0;
		let lastParent: IAnyResult | undefined;

		const threeDeep = {
			...testGroupResult(),
			results: [{
				...testGroupResult(),
				results: [{
					...testTestResult()
				}]
			}]
		};

		const output = walkResults(threeDeep, (result, parent) => {
			count++;
			lastParent = parent;

			return result.type === 'test';
		});

		assert.is(count, 3);
		assert.is(output, true);
		assert.is(lastParent!, threeDeep.results[0]);
	});
});
