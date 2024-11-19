import blns from 'blns';
import { assert, beforeEach, describe, it } from '../../../index.js';
import logs from '../../child/logs.js';
import renderLine from './renderLine.js';

describe('renderLine', () => {
	describe('naughty strings', () => {
		beforeEach(() => {
			logs.pop();
			logs.tag('test');
		});

		blns.forEach((naughtyString) => {
			it(`should handle ${ naughtyString }`, () => {
				renderLine([['blank', naughtyString]]);

				const output = logs.pop();

				assert.equal(output.length, 1);
			});
		});
	});
});
