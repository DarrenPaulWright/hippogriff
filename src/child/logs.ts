/* eslint no-console:off */
import { clone } from 'object-agent';
import type { ILog } from '../hippogriff.models.js';

class Logs {
	private data: Array<ILog> = [];
	private _tags: Array<string> = [''];
	private originalLog = console.log;
	private originalWarn = console.warn;
	private originalError = console.error;
	private isPaused = true;

	constructor() {
		this.start();
	}

	private logWrapper(type: ILog['type']) {
		return (...args: Array<unknown>): void => {
			this.data.push({
				tag: this._tags[this._tags.length - 1],
				type,
				data: clone(args) as Array<unknown>
			});
		};
	}

	start(): void {
		if (this.isPaused) {
			this.isPaused = false;

			console.log = this.logWrapper('log');
			console.warn = this.logWrapper('warn');
			console.error = this.logWrapper('error');
		}
	}

	pause(): void {
		console.log = this.originalLog;
		console.error = this.originalError;
		console.warn = this.originalWarn;
		this.isPaused = true;
	}

	pop(): Array<ILog> {
		const tag = this._tags[this._tags.length - 1];
		const output = this.data.filter((item) => item.tag === tag);

		this.data = this.data.filter((item) => item.tag !== tag);
		this._tags.pop();

		return output;
	}

	purge(): Array<ILog> {
		const output = [...this.data];

		this.data.length = 0;
		this._tags = [''];

		return output;
	}

	tag(tag: string): void {
		this._tags.push(tag);
	}

	untag(): void {
		this._tags.pop();
	}
}

export default new Logs();
