import { fill } from 'async-agent';
import type {
	IBenchResult,
	IBenchSettings,
	IInternalSettings,
	IInternalWork,
	ISampleResult,
	ITimeoutHooks,
	WorkCallback
} from '../hippogriff.models';
import canRun from '../utility/process/canRun.js';
import iterationsPerSample from './bench/iterationsPerSample.js';
import remainingSamples from './bench/remainingSamples.js';
import sample from './bench/sample.js';
import logs from './logs.js';

export interface IInitialBenchResult {
	error: Error | false;
	remainingSamples: number;
	iterations: number;
	samples: Array<number>;
	cycles: number;
	duration: number;
	isPromise: boolean | null;
}

const defaultSettings: IInitialBenchResult = {
	error: false,
	remainingSamples: 0,
	iterations: 0,
	samples: [],
	cycles: 0,
	duration: 0,
	isPromise: null
};

const doBench = (
	work: WorkCallback,
	settings: IBenchSettings,
	data: IInitialBenchResult
): Promise<IInitialBenchResult> => {
	return fill(data.remainingSamples, () => {
		return sample(
			work,
			data.iterations,
			data.isPromise,
			settings
		);
	})
		.then((results: Array<ISampleResult>) => {
			results.forEach((result) => {
				if (result.time > 0) {
					data.samples.push(result.time);
				}

				data.duration += result.duration;
			});

			data.iterations = iterationsPerSample(data.samples);
			data.remainingSamples = remainingSamples(
				data.samples,
				data.iterations,
				settings.benchMaxSamples!,
				settings.benchMaxDuration!,
				data.duration
			);
			data.isPromise = results[0].isPromise;
			data.cycles++;

			return (data.remainingSamples === 0) ?
				data :
				doBench(work, settings, data);
		});
};

const processBench = (
	title: string,
	hasOnly: () => boolean,
	settings: IInternalSettings,
	work: WorkCallback,
	hooks: ITimeoutHooks
): IInternalWork => {
	return {
		type: 'bench',
		skip: settings.skip,
		index: settings.index,
		work: (resolve): void => {
			const done = (isSkipped: boolean, result: IInitialBenchResult): void => {
				const output: IBenchResult = {
					type: 'bench',
					title,
					isSkipped,
					...result,
					settings,
					logs: logs.pop()
				};

				hooks.onUpdate(output);
				resolve(output);
			};

			if (canRun(hasOnly(), settings)) {
				if (global.gc) {
					global.gc();
				}

				logs.tag('bench');

				hooks.onStart();

				doBench(work, {
					...settings,
					beforeEach: settings.parent!.lifeCycle.beforeEach,
					afterEach: settings.parent!.lifeCycle.afterEach
				}, {
					error: false,
					remainingSamples: 1,
					iterations: 1,
					samples: [],
					cycles: 0,
					duration: 0,
					isPromise: null
				})
					.then((results) => {
						hooks.onStop();
						done(false, results);
					})
					.catch((error) => {
						hooks.onStop();
						done(
							false,
							{
								...defaultSettings,
								error: error as Error
							}
						);
					});
			}
			else {
				done(true, defaultSettings);
			}
		}
	};
};

export default processBench;
