import { assert, describe, it } from '../../../index.js';
import { testGroupResult } from '../../../sampleTests/testData.helper.js';
import renderLogs from './renderLogs.js';

describe('renderLogs', () => {
	it('should handle empty logs', () => {
		const lines = renderLogs(testGroupResult());

		assert.equal(lines, []);
	});

	it('should handle a log', () => {
		const lines = renderLogs({
			...testGroupResult(),
			logs: [{
				tag: '',
				type: 'log',
				data: ['foo']
			}]
		});

		assert.equal(
			lines,
			[
				[
					['logs', 'log: '],
					['logs', '"foo"']
				],
				[]
			]
		);
	});

	it('should handle a log with multiple items', () => {
		const lines = renderLogs({
			...testGroupResult(),
			logs: [{
				tag: '',
				type: 'log',
				data: ['foo', 'bar']
			}]
		});

		assert.equal(
			lines,
			[
				[
					['logs', 'log: '],
					['logs', '"foo", "bar"']
				],
				[]
			]
		);
	});

	it('should handle multiple logs', () => {
		const lines = renderLogs({
			...testGroupResult(),
			logs: [{
				tag: '',
				type: 'log',
				data: ['foo', 'bar']
			}, {
				tag: '',
				type: 'warn',
				data: ['banana']
			}]
		});

		assert.equal(
			lines,
			[
				[
					['logs', 'log: '],
					['logs', '"foo", "bar"']
				],
				[
					['logs', 'warn: '],
					['logs', '"banana"']
				],
				[]
			]
		);
	});
});
