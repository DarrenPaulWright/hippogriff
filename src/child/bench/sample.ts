import { repeat } from 'async-agent';
import { performance, PerformanceObserver } from 'node:perf_hooks';
import type { IBenchSettings, ISampleResult, WorkCallback } from '../../hippogriff.models.js';
import sequence from '../../utility/async/sequence.js';

const timerify = (
	timedCallback: WorkCallback,
	iterations: number,
	work: (callback: WorkCallback) => Promise<unknown>
): Promise<number> => {
	return new Promise((resolve, reject) => {
		const wrapped = performance.timerify(timedCallback);
		let count = 0;
		const allEntries: Array<PerformanceEntry> = [];

		const observer = new PerformanceObserver((list) => {
			count++;
			const entries = list.getEntries();

			allEntries.push(...entries);

			if (entries.length === iterations || count === iterations) {
				const duration = (allEntries.length === iterations ? allEntries : entries)
					.reduce<number>((sum, entry) => sum + entry.duration, 0);

				performance.clearMarks();
				performance.clearMeasures();

				observer.disconnect();

				resolve(duration);
			}
		});

		observer.observe({ entryTypes: ['function'] });

		work(wrapped)
			.catch((error) => {
				reject(error as Error);
			});
	});
};

export default (
	work: WorkCallback,
	iterations: number,
	isKnownPromise: boolean | null,
	settings: IBenchSettings
): Promise<ISampleResult> => {
	let isPromise = isKnownPromise === null ? false : isKnownPromise;

	const promise: Promise<number> = (isKnownPromise === null) ?
		timerify(work, 1, (wrapped) => {
			return sequence(settings.beforeEach)
				.then(() => {
					const result = wrapped();

					isPromise = result instanceof Promise;

					return result;
				})
				.then(() => {
					return sequence(settings.afterEach);
				});
		}) :
		timerify(work, iterations, (wrapped) => {
			return repeat(iterations, () => {
				return sequence(settings.beforeEach)
					.then(() => wrapped())
					.then(() => sequence(settings.afterEach))
					.then(() => false);
			});
		});

	return promise.then((duration) => ({
		duration,
		isPromise,
		time: duration / iterations
	}));
};
