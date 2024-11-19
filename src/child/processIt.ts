import type {
	IAssertionError,
	IInternalSettings,
	IInternalWork,
	ITestResult,
	ITimeoutHooks,
	WorkCallback
} from '../hippogriff.models';
import promisify from '../utility/async/promisify.js';
import sequence from '../utility/async/sequence.js';
import canRun from '../utility/process/canRun.js';
import logs from './logs.js';

export interface IInitialTestResult {
	error: Error | false;
	duration: number;
}

const doTest = (
	work: WorkCallback,
	onStart: () => void,
	onEnd: () => void
): Promise<IInitialTestResult> => {
	return new Promise<IInitialTestResult>((resolve) => {
		promisify(work, onStart, onEnd)
			.then((duration) => {
				resolve({
					error: false,
					duration
				});
			})
			.catch((error) => {
				resolve({
					error: error as Error,
					duration: (error as IAssertionError).duration || 0
				});
			});
	});
};

const processIt = (
	title: string,
	hasOnly: () => boolean,
	settings: IInternalSettings,
	work: WorkCallback,
	hooks: ITimeoutHooks
): IInternalWork => {
	return {
		type: 'test',
		skip: settings.skip,
		index: settings.index,
		work: (resolve): void => {
			const done = (isSkipped: boolean, result: IInitialTestResult): void => {
				const output: ITestResult = {
					type: 'test',
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
				// eslint-disable-next-line @typescript-eslint/init-declarations
				let finalResults: IInitialTestResult;

				logs.tag('test');

				sequence(settings.parent!.lifeCycle.beforeEach)
					.then(() => doTest(work, hooks.onStart, hooks.onStop))
					.then((results) => {
						finalResults = results;

						return sequence(settings.parent!.lifeCycle.afterEach);
					})
					.then(() => {
						done(false, finalResults);
					})
					.catch((error) => {
						done(false, { error: error as Error, duration: 0 });
					});
			}
			else {
				done(true, { error: false, duration: 0 });
			}
		}
	};
};

export default processIt;
