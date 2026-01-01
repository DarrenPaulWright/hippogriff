import { setTimeout } from 'node:timers';
import { isObject } from 'type-enforcer';
import baseDescribe from './child/baseDescribe.js';
import logs from './child/logs.js';
import processBench from './child/processBench.js';
import processDescribe from './child/processDescribe.js';
import processIt from './child/processIt.js';
import type {
	IDescribe,
	IGroupResult,
	IMainProcessDataIn,
	IMainProcessDataOut,
	ISettings,
	ISettingsPlus,
	WorkCallback
} from './hippogriff.models';
import castPromise from './utility/async/castPromise.js';
import LifecycleError from './utility/LifecycleError.js';

let hasOnly = false;
let isPreProcessed = false;
let currentDescribe = baseDescribe;
let describeIndex = 0;

type MainInternalCallback = (title: string, work: WorkCallback, settings: ISettingsPlus) => void;

interface MainCallback {
	(title: string, work?: WorkCallback, settings?: ISettings): void;

	skip: (title: string, work: WorkCallback, settings?: ISettings) => void;
	only: (title: string, work: WorkCallback, settings?: ISettings) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFunction = (): void => {
};

const extendExport = (callback: MainInternalCallback): MainCallback => {
	return Object.assign(
		(title: string, work?: WorkCallback, settings?: ISettings): void => {
			callback(
				title,
				work ?? emptyFunction,
				{ ...settings, only: false, skip: !work }
			);
		},
		{
			skip: (title: string, work?: WorkCallback, settings?: ISettings): void => {
				callback(
					title,
					work ?? emptyFunction,
					{ ...settings, only: false, skip: true }
				);
			},
			only: (title: string, work?: WorkCallback, settings?: ISettings): void => {
				hasOnly = true;

				callback(
					title,
					work ?? emptyFunction,
					{ ...settings, only: true, skip: false }
				);
			}
		}
	);
};

const convertError = (error: Error): Record<string, unknown> => {
	return Object.getOwnPropertyNames(error)
		.reduce<Record<string, unknown>>((result, name) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			result[name] = error[name] as unknown;

			return result;
		}, {});
};

const send = (data: IMainProcessDataOut): void => {
	if ('result' in data && data.result.error) {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		data.result.error = convertError(data.result.error);
	}

	process.send!(data);
};

process.on('message', (data: IMainProcessDataIn) => {
	if (isObject(data) && data.type === 'ready') {
		hasOnly = data.hasOnly;

		const onUpdate = (result: IGroupResult): void => {
			send({
				type: 'group',
				index: 0,
				result
			});
		};

		new Promise(processDescribe(() => hasOnly, baseDescribe, onUpdate, 0, data.startIndex).work)
			.catch((error: Error): void => {
				send({
					type: 'error',
					error
				});
			});
	}
});

setTimeout(() => {
	isPreProcessed = true;
	send({ type: 'only', hasOnly });
}, 0);

export const describe = extendExport((title, work, settings) => {
	if (isPreProcessed) {
		throw new LifecycleError('"describe" function called within a Hippogriff function');
	}

	const parent = currentDescribe;
	const thisDescribe: IDescribe = {
		title,
		lifeCycle: {
			before: [],
			beforeEach: [...parent.lifeCycle.beforeEach],
			work: [],
			afterEach: [...parent.lifeCycle.afterEach],
			after: []
		},
		settings: {
			...parent.settings,
			...settings,
			index: ++describeIndex,
			parent
		}
	};

	const internalWork = processDescribe(
		() => hasOnly,
		thisDescribe,
		(result) => {
			send({
				type: 'group',
				index: thisDescribe.settings.index,
				result
			});
		},
		thisDescribe.settings.index
	);

	parent.lifeCycle.work.push(internalWork);

	currentDescribe = thisDescribe;

	try {
		work();
	}
	catch (error) {
		internalWork.error = error as Error;
	}

	logs.untag();
	currentDescribe = parent;
});

export const when = describe;

let workIndex = 0;

export const bench = extendExport((title, work, settings) => {
	if (isPreProcessed) {
		throw new LifecycleError('"bench" function called within a Hippogriff function');
	}

	const internalSettings = {
		...currentDescribe.settings,
		...settings,
		index: workIndex++,
		parent: currentDescribe
	};

	currentDescribe.lifeCycle.work.push(processBench(
		title,
		() => hasOnly,
		internalSettings,
		work,
		{
			onStart: () => {
				send({
					type: 'start',
					index: internalSettings.index,
					title,
					timeout: internalSettings.benchMaxDuration * 10
				});
			},
			onStop: () => {
				send({
					type: 'stop',
					index: internalSettings.index
				});
			},
			onUpdate: (result) => {
				send({
					type: 'update',
					index: internalSettings.index,
					result
				});
			}
		}
	));
});

export const it = extendExport((title, work, settings) => {
	if (isPreProcessed) {
		throw new LifecycleError('"it" function called within a Hippogriff function');
	}

	const internalSettings = {
		...currentDescribe.settings,
		...settings,
		index: workIndex++,
		parent: currentDescribe
	};

	currentDescribe.lifeCycle.work.push(processIt(
		title,
		() => hasOnly,
		internalSettings,
		work,
		{
			onStart: () => {
				send({
					type: 'start',
					index: internalSettings.index,
					title,
					timeout: internalSettings.testTimeout
				});
			},
			onStop: () => {
				send({
					type: 'stop',
					index: internalSettings.index
				});
			},
			onUpdate: (result) => {
				send({
					type: 'update',
					index: internalSettings.index,
					result
				});
			}
		}
	));
});

const lifeCycleWrapper = (work: WorkCallback, hookType: string): () => Promise<void> => {
	return () => new Promise((resolve, reject) => {
		castPromise(work)
			.then(resolve)
			.catch((error) => {
				(error as Error).message = `Error in "${ hookType }" hook: ${
					(error as Error).message
				}`;
				reject(error as Error);
			});
	});
};

/**
 * Executes once before anything else within the same scope.
 */
export const before = (work: WorkCallback): void => {
	currentDescribe.lifeCycle.before.push(lifeCycleWrapper(work, 'before'));
};

/**
 * Executes immediately before each test or bench within the same scope and child scopes.
 */
export const beforeEach = (work: WorkCallback): void => {
	currentDescribe.lifeCycle.beforeEach.push(lifeCycleWrapper(work, 'beforeEach'));
};

/**
 * Executes immediately after each test or bench within the same scope and child scopes.
 */
export const afterEach = (work: WorkCallback): void => {
	currentDescribe.lifeCycle.afterEach.unshift(lifeCycleWrapper(work, 'afterEach'));
};

/**
 * Executes once after everything else within the same scope.
 */
export const after = (work: WorkCallback): void => {
	currentDescribe.lifeCycle.after.unshift(lifeCycleWrapper(work, 'after'));
};
