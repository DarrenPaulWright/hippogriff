import { performance } from 'node:perf_hooks';
import { setTimeout } from 'node:timers';
import { assert, describe, it } from '../../../index.js';
import sequence from './sequence.js';

describe('sequence', () => {
	it('should execute promises sequentially', () => {
		let count = 0;
		const start = performance.now();

		return sequence([
			(): Promise<number> => {
				return new Promise<number>((resolve) => {
					assert.is(count, 0);

					count++;

					setTimeout(() => {
						assert.is(count, 1);
						resolve(10);
					}, 10);
				});
			},
			(): Promise<number> => {
				return new Promise<number>((resolve) => {
					assert.is(count, 1);
					count++;

					setTimeout(() => {
						assert.is(count, 2);
						resolve(11);
					}, 10);
				});
			},
			(): Promise<number> => {
				return new Promise<number>((resolve) => {
					assert.is(count, 2);
					count++;

					setTimeout(() => {
						assert.is(count, 3);
						resolve(12);
					}, 10);
				});
			}
		])
			.then((output) => {
				assert.is(count, 3);
				assert.equal(output, [10, 11, 12]);
				assert.moreThan(performance.now() - start, 30);
			});
	});

	it('should catch an error', () => {
		const count = 0;

		return sequence([
			(): Promise<void> => Promise.resolve(),
			(): Promise<void> => {
				return new Promise<void>(() => {
					throw new Error('Test');
				});
			}
		])
			.then(() => {
				assert.is(count, 3);
			})
			.catch((error) => {
				assert.instanceOf(error, Error);
				assert.is(error.message, 'Test');
			});
	});
});
