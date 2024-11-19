import { performance } from 'node:perf_hooks';
import type { AssertionError } from '../../hippogriff.models.js';
import castPromise from './castPromise.js';

const promisify = <T>(
	work: () => (Promise<T> | T),
	onStart?: () => void,
	onEnd?: () => void
): Promise<number> => {
	return new Promise((resolve, reject) => {
		onStart?.();

		const start = performance.now();

		castPromise(work)
			.then(() => {
				const duration = performance.now() - start;

				onEnd?.();

				resolve(duration);
			})
			.catch((error) => {
				(error as AssertionError).duration = performance.now() - start;

				onEnd?.();

				reject(error as AssertionError);
			});
	});
};

export default promisify;
