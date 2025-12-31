import { type ChildProcess, fork } from 'node:child_process';
import { basename, relative } from 'node:path';
import { clearTimeout, setTimeout } from 'node:timers';
import { isObject } from 'type-enforcer';
import baseDescribe from '../child/baseDescribe.js';
import type {
	IBenchResult,
	IGroupResult,
	IMainProcessDataIn,
	IMainProcessDataOut,
	IMainProcessTimerStart,
	ITestResult
} from '../hippogriff.models.js';
import LifecycleError from '../utility/LifecycleError.js';
import consolidateResults from '../utility/process/consolidateResults.js';
import mergeResults from '../utility/process/mergeResults.js';
import renderError from './render/renderError.js';
import renderLine from './render/renderLine.js';
import renderResult from './render/renderResult.js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const emptyFunction = (): void => {
};

export default class RunFile {
	private isVerbose = false;
	private fork: ChildProcess | undefined;
	private _onReady: () => void = emptyFunction;
	private _onRunDone: (resuts: IGroupResult) => void = emptyFunction;
	private timeoutId?: ReturnType<typeof setTimeout>;
	private timeoutErrors: Array<number> = [];
	private resultsFlat: Array<Partial<ITestResult> | Partial<IBenchResult>> = [];
	private groupsFlat: Array<IGroupResult> = [];
	private isEmptyFile = false;
	private runError: Error | null = null;

	path: string;
	hasOnly = false;
	isReady = false;

	constructor(path: string, isVerbose: boolean) {
		this.path = path;
		this.isVerbose = isVerbose;

		this.start();
	}

	private startTimer(data: IMainProcessTimerStart): void {
		this.timeoutId = setTimeout(() => {
			this.timeoutErrors.push(data.index);
			this.resultsFlat[data.index] = {
				title: data.title,
				error: new LifecycleError('Timeout'),
				duration: data.timeout
			};

			this.exit();
			this.start();
		}, data.timeout);
	}

	private markReady(hasOnly: boolean): void {
		this.isReady = true;
		this.hasOnly = hasOnly;

		if (this.timeoutErrors.length === 0) {
			this._onReady();
		}
		else {
			this.ready();
		}
	}

	private onData(data: IMainProcessDataOut): void {
		if (isObject(data)) {
			switch (data.type) {
				case 'error': {
					this.onError(data.error);

					break;
				}

				case 'start': {
					this.startTimer(data);

					break;
				}

				case 'stop': {
					clearTimeout(this.timeoutId);

					break;
				}

				case 'update': {
					clearTimeout(this.timeoutId);
					this.resultsFlat[data.index] ||= data.result;

					break;
				}

				case 'group': {
					this.groupsFlat[data.index] = data.result;

					if (data.index === 0) {
						this._onRunDone(renderResult(
							consolidateResults(
								mergeResults(
									this.groupsFlat,
									this.resultsFlat
								)
							),
							this.isVerbose
						));

						this.exit();
					}

					break;
				}

				case 'only': {
					this.markReady(data.hasOnly);

					break;
				}
			}
		}
	}

	private getEmptyResult(): IGroupResult {
		return {
			title: basename(this.path),
			isSkipped: true,
			type: 'group',
			settings: baseDescribe.settings,
			logs: [],
			results: [],
			error: false,
			summary: {
				passCount: 0,
				failCount: 0,
				skipCount: 0,
				errorsDurations: [],
				passingDurations: []
			}
		};
	}

	private onForkExit(): void {
		if (!this.isReady || this.runError) {
			this.isEmptyFile = true;

			this.onData({
				type: 'only',
				hasOnly: false
			});

			const result = this.getEmptyResult();

			if (this.runError) {
				result.isSkipped = false;
				result.error = this.runError;
			}

			this.onData({
				type: 'group',
				index: 0,
				result
			});
		}
	}

	private start(): void {
		const controller = new AbortController();

		this.fork = fork(this.path, {
			execArgv: ['--expose-gc'],
			detached: false,
			signal: controller.signal,
			silent: true
		})
			.on('message', this.onData.bind(this))
			.on('exit', this.onForkExit.bind(this));

		this.fork.stderr?.on('data', (data) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
			const errorString = (data.toString() as string)
				.split('\n')
				.slice(0, 3)
				.join('\n');

			this.runError = new Error(errorString);
		});
	}

	private ready(): void {
		this.fork?.send({
			type: 'ready',
			hasOnly: this.hasOnly,
			startIndex: this.timeoutErrors.length === 0 ?
				0 :
				this.timeoutErrors[this.timeoutErrors.length - 1] + 1
		} as IMainProcessDataIn);
	}

	private exit(): void {
		this.fork?.kill('SIGINT');
		this.fork = undefined;
	}

	private onError(error: Error): void {
		renderLine(
			[
				['', 'Error'],
				['subText', ' in '],
				['group', relative(process.cwd(), this.path)]
			]
		);
		renderLine();

		renderError(error)
			.forEach((line) => {
				renderLine(line);
			});

		const result = this.getEmptyResult();
		result.error = error;
		this._onRunDone(result);
		this.exit();
	}

	onReady(): Promise<void> {
		return new Promise((resolve) => {
			this._onReady = resolve;
		});
	}

	run(hasOnly: boolean): Promise<IGroupResult> {
		this.hasOnly = hasOnly;

		const output = new Promise<IGroupResult>((resolve) => {
			if (this.isEmptyFile) {
				resolve(this.getEmptyResult());
				this.exit();
			}
			else {
				this._onRunDone = resolve;
			}
		});

		if (!this.isEmptyFile) {
			this.ready();
		}

		return output;
	}
}
