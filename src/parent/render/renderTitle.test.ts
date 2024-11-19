import { assert, describe, it } from '../../../index.js';
import {
	testBenchResult,
	testGroupResult,
	testTestResult
} from '../../../sampleTests/testData.helper.js';
import renderTitle from './renderTitle.js';

const thisTestGroupResult = {
	...testGroupResult(),
	title: 'file'
};

describe('renderTitle', () => {
	describe('file', () => {
		it('should render a skipped file', () => {
			const lines = renderTitle({
				...thisTestGroupResult,
				isSkipped: true
			});

			assert.equal(lines, [['skip', ' ● file SKIPPED']]);
		});

		it('should render a file with no results and verbose', () => {
			const lines = renderTitle(thisTestGroupResult);

			assert.equal(lines, [['passGroup', ' ● '], ['passGroup', 'file']]);
		});

		it('should render a file with no results', () => {
			const lines = renderTitle(thisTestGroupResult);

			assert.equal(lines, [['passGroup', ' ● '], ['passGroup', 'file']]);
		});

		it('should render a file with tests', () => {
			const lines = renderTitle({
				...thisTestGroupResult,
				summary: {
					...thisTestGroupResult.summary,
					passCount: 2,
					passingDurations: [1, 2]
				},
				results: [{
					...testTestResult(),
					duration: 1
				}, {
					...testTestResult(),
					duration: 2
				}]
			});

			assert.equal(lines, [
				['passGroup', ' ● '],
				['passGroup', 'file'],
				['count', '  2 tests'],
				['stats', ' • ∑: 3ms • M: 1.5ms • Mdn: 1.5ms']
			]);
		});

		it('should render a file with tests excluding bench', () => {
			const lines = renderTitle({
				...thisTestGroupResult,
				summary: {
					...thisTestGroupResult.summary,
					passCount: 2,
					passingDurations: [1, 2]
				},
				results: [{
					...testTestResult(),
					duration: 1
				}, {
					...testTestResult(),
					duration: 2
				}, {
					...testBenchResult(),
					samples: [1, 2, 3]
				}]
			});

			assert.equal(lines, [
				['passGroup', ' ● '],
				['passGroup', 'file'],
				['count', '  2 tests'],
				['stats', ' • ∑: 3ms • M: 1.5ms • Mdn: 1.5ms']
			]);
		});

		it('should render a file with bench', () => {
			const lines = renderTitle({
				...thisTestGroupResult,
				summary: {
					...thisTestGroupResult.summary,
					passingDurations: []
				},
				results: [{
					...testBenchResult(),
					samples: [1, 2, 3]
				}, {
					...testBenchResult(),
					samples: [1, 2, 3]
				}, {
					...testBenchResult(),
					samples: [1, 2, 3]
				}]
			});

			assert.equal(lines, [
				['passGroup', ' ● '],
				['passGroup', 'file']
			]);
		});
	});

	describe('test', () => {
		it('should render a skipped test', () => {
			const lines = renderTitle({
				...testTestResult(),
				title: 'test',
				isSkipped: true
			});

			assert.equal(lines, [['skip', ' — test SKIPPED']]);
		});

		it('should render a passed test', () => {
			const lines = renderTitle({
				...testTestResult(),
				title: 'test',
				duration: 0.02
			});

			assert.equal(lines, [
				['pass', '✔ '],
				['pass', 'test'],
				['stats', '  20μs']
			]);
		});

		it('should render a failed test', () => {
			const lines = renderTitle({
				...testTestResult(),
				title: 'test',
				error: new Error('foo'),
				duration: 0.02
			});

			assert.equal(lines, [
				['fail', '✖ '],
				['fail', 'test'],
				['stats', '  20μs']
			]);
		});
	});

	describe('bench', () => {
		it('should render a skipped bench', () => {
			const lines = renderTitle({
				...testBenchResult(),
				isSkipped: true
			});

			assert.equal(lines, [['skip', ' — bench SKIPPED']]);
		});

		it('should render a passed bench', () => {
			const lines = renderTitle(testBenchResult());

			assert.equal(lines, [
				['pass', '✔ '],
				['pass', 'bench']
			]);
		});

		it('should render a failed bench', () => {
			const lines = renderTitle({
				...testBenchResult(),
				error: new Error('Test')
			});

			assert.equal(lines, [
				['fail', '✖ '],
				['fail', 'bench']
			]);
		});
	});
});
