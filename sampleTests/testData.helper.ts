/* eslint @typescript-eslint/no-empty-function:off */
import { clone } from 'object-agent';
import baseDescribe from '../src/child/baseDescribe.js';
import type {
	IBenchResult,
	IDescribe,
	IGroupResult,
	IInternalSettings,
	ITestResult,
	ITimeoutHooks
} from '../src/hippogriff.models.js';

export const testDescribe: IDescribe = clone(baseDescribe) as IDescribe;

export const testLifeCycle = (): IDescribe['lifeCycle'] => {
	return clone(testDescribe.lifeCycle) as IDescribe['lifeCycle'];
};

export const testTimeoutHooks: ITimeoutHooks = {
	onStart: (): void => {
	},
	onStop: (): void => {
	},
	onUpdate: (): void => {
	}
};

export const testInternalSettings = (): IInternalSettings => ({
	...testDescribe.settings,
	parent: testDescribe
});

const baseResult = {
	title: testDescribe.title,
	isSkipped: false,
	settings: testDescribe.settings,
	logs: []
};

export const testTestResult = (): ITestResult => ({
	...baseResult,
	type: 'test',
	error: false,
	duration: 1
});

export const testBenchResult = (): IBenchResult => ({
	...baseResult,
	title: 'bench',
	error: false,
	remainingSamples: 0,
	iterations: 0,
	samples: [1],
	cycles: 0,
	duration: 1,
	isPromise: false,
	type: 'bench'
});

export const testGroupResult = (): IGroupResult => ({
	...baseResult,
	type: 'group',
	results: [],
	error: false,
	summary: {
		passCount: 0,
		failCount: 0,
		skipCount: 0,
		passingDurations: [],
		errorsDurations: []
	}
});
