import type colorize from './parent/colorize.js';

export type Color = keyof typeof colorize;

export type RenderLineStructure = [Color, string | number];

export type WorkCallback = () => (Promise<void> | void);

interface IMainProcessOnly {
	type: 'only';
	hasOnly: boolean;
}

interface IMainProcessReady {
	type: 'ready';
	hasOnly: boolean;
	startIndex: number;
}

interface IMainProcessError {
	type: 'error';
	error: Error;
}

export interface IMainProcessTimerStart {
	type: 'start';
	index: number;
	title: string;
	timeout: number;
}

interface IMainProcessTimerStop {
	type: 'stop';
	index: number;
}

interface IMainProcessTimerUpdate {
	type: 'update';
	index: number;
	result: ITestResult | IBenchResult;
}

interface IMainProcessGroup {
	type: 'group';
	index: number;
	result: IGroupResult;
}

export type IMainProcessDataIn = IMainProcessReady;

export type IMainProcessDataOut = IMainProcessOnly |
	IMainProcessError |
	IMainProcessTimerStart |
	IMainProcessTimerStop |
	IMainProcessTimerUpdate |
	IMainProcessGroup;

export interface ISettings {

	/** Timeout for tests in ms. Default: 2000. */
	testTimeout?: number;

	/** Max samples to take per bench. Default: 100. */
	benchMaxSamples?: number;

	/** Max total duration for each bench. Default: 200. */
	benchMaxDuration?: number;

	/** Render individual charts for each describe/when. Default: false. */
	benchDistinctCharts?: boolean;

	/** Render  bench results as durations instead of operations per second. Default: false. */
	benchDuration?: boolean;

	/** Color theme for bench charts. Default: "light". */
	benchColors?: 'none' | 'light' | 'bright' | 'dim' | 'cool' | 'passFail' | 'blue' | 'green' | 'magenta' | 'yellow' | 'cyan' | 'red';
}

export interface ISettingsPlus extends ISettings {
	skip: boolean;
	only: boolean;
}

export interface IBenchSettings extends ISettingsPlus {
	beforeEach: Array<() => Promise<void>>;
	afterEach: Array<() => Promise<void>>;
}

export interface IInternalSettings extends Required<ISettingsPlus> {
	index: number;
	parent?: IDescribe;
}

export interface ITimeoutHooks {
	onStart: () => void;
	onStop: () => void;
	onUpdate: (result: ITestResult | IBenchResult) => void;
}

export interface IAssertionError extends Error {
	showDiff?: boolean;
	expected?: unknown;
	actual?: unknown;
	duration?: number;
}

export interface IInternalWork {
	type: 'group' | 'test' | 'bench';
	skip: boolean;
	index: number;
	work: (
		resolve: (data: IGroupResult | IBenchResult | ITestResult) => void,
		reject: (error: Error) => void
	) => void;
	error?: Error;
}

export interface ILifeCycleHooks {
	before: Array<() => Promise<void>>;
	beforeEach: Array<() => Promise<void>>;
	work: Array<IInternalWork>;
	afterEach: Array<() => Promise<void>>;
	after: Array<() => Promise<void>>;
}

export interface IDescribe {
	title: string;
	lifeCycle: ILifeCycleHooks;
	settings: IInternalSettings;
}

export interface AssertionError extends Error {
	showDiff: boolean;
	expected: unknown;
	actual: unknown;
	duration?: number;
}

export type Diff = ['removedRow' | 'removed' | 'addedRow' | 'added', string];

export interface ILog {
	tag: string;
	type: 'log' | 'warn' | 'error';
	data: Array<unknown>;
}

interface IResultBase {
	title: string;
	isSkipped: boolean;
	settings: IInternalSettings;
	logs: Array<ILog>;
}

export interface ITestResult extends IResultBase {
	type: 'test';
	error: Error | false;
	duration: number;
}

export interface IBenchResult extends IResultBase {
	type: 'bench';
	error: Error | false;
	remainingSamples: number;
	iterations: number;
	samples: Array<number>;
	cycles: number;
	duration: number;
	isPromise: boolean | null;
}

export interface IGroupResult extends IResultBase {
	type: 'group';
	results: Readonly<Array<IAnyResult>>;
	error: Error | false;
	summary: {
		passCount: number;
		failCount: number;
		skipCount: number;
		passingDurations: Array<number>;
		errorsDurations: Array<number>;
	};
}

export type IAnyResult = IGroupResult | ITestResult | IBenchResult;

export interface ISampleResult {
	duration: number;
	time: number;
	isPromise: boolean;
}
