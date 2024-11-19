import { assert, describe, it } from '../../../index.js';
import { testGroupResult } from '../../../sampleTests/testData.helper.js';
import renderSummary from './renderSummary.js';

describe('renderSummary', () => {
	it('should render', () => {
		const { passed, errors, lines } = renderSummary(
			[{
				...testGroupResult(),
				summary: {
					...testGroupResult().summary,
					passingDurations: [1]
				}
			}],
			false
		);

		assert.is(errors, 0);
		assert.is(passed, 1);
		assert.is(lines.length, 7);
		assert.equal(lines[0], []);
		assert.equal(lines[1], [
			['', 'Summary:'],
			['count', '  1 test'],
			['count', ' • '],
			['pass', 'pass: 1'],
			['stats', ' • ∑: 1ms']
		]);
		assert.equal(lines[lines.length - 1], []);
	});

	it('should not render an initial blank line if verbose is true', () => {
		const { passed, errors, lines } = renderSummary(
			[{
				...testGroupResult(),
				summary: {
					passCount: 1,
					failCount: 1,
					skipCount: 1,
					passingDurations: [1],
					errorsDurations: [2]
				}
			}],
			true
		);

		assert.is(errors, 1);
		assert.is(passed, 1);
		assert.is(lines.length, 6);
		assert.equal(lines[0], [
			['', 'Summary:'],
			['count', '  3 tests'],
			['count', ' • '],
			['pass', 'pass: 1'],
			['count', ' • '],
			['fail', 'fail: 1'],
			['count', ' • '],
			['skip', 'skip: 1'],
			['stats', ' • ∑: 3ms • ∑ passing: 1ms • M: 1.5ms • M passing: 1ms • Mdn passing: 1ms']
		]);
		assert.equal(lines[lines.length - 1], []);
	});
});
