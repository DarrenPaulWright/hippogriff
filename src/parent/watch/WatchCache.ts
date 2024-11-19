import { minimatch } from 'minimatch';
import { relative } from 'node:path';
import type { IGroupResult } from '../../hippogriff.models';
import type ReadFile from '../../utility/readFile.js';
import renderLine from '../render/renderLine.js';
import renderSummary from '../render/renderSummary.js';
import type RunFile from '../RunFile.js';
import runFiles from '../runFiles.js';
import WatchRelationships from './WatchRelationships.js';

interface ICacheStatus {
	status: IGroupResult | null;
	isRunning: boolean;
	hasOnly: boolean;
}

export default class WatchCache {
	private filesGlob = '';
	private isVerbose = false;
	private allTestResults: { [path: string]: ICacheStatus } = {};
	private relationships: WatchRelationships;

	constructor(
		filesGlob: string,
		isVerbose: boolean,
		readFile: typeof ReadFile
	) {
		this.relationships = new WatchRelationships(readFile);
		this.filesGlob = filesGlob;
		this.isVerbose = isVerbose;
	}

	private isTestFile(path: string): boolean {
		return minimatch(path, this.filesGlob);
	}

	private addTestFile(path: string): Promise<void> {
		return new Promise((resolve, reject) => {
			if (path in this.allTestResults) {
				resolve();
			}
			else {
				this.allTestResults[path] = {
					status: null,
					isRunning: false,
					hasOnly: false
				};

				this.relationships.addTestFile(path)
					.then(resolve)
					.catch(reject);
			}
		});
	}

	private hasOnly(): boolean {
		return Object.values(this.allTestResults)
			.reduce((result, item) => result || item.hasOnly, false);
	}

	private async runTests(paths: Array<string>): Promise<void> {
		renderLine([['', 'Running…\n']]);

		const hasOnlyOriginal = this.hasOnly();
		let hasOnly = false;
		let skipTests = false;

		const hasOnlyCallback = (
			children: Array<RunFile>
		): [boolean, boolean] => {
			children.forEach((child) => {
				this.allTestResults[child.path].hasOnly = child.hasOnly;
			});

			hasOnly = this.hasOnly();
			skipTests = hasOnlyOriginal && !hasOnly;

			return [hasOnly, skipTests];
		};

		paths.forEach((path) => {
			this.allTestResults[path].isRunning = true;
		});

		const results = await runFiles(paths, this.isVerbose, hasOnlyCallback);

		if (!skipTests) {
			results.forEach((result, index) => {
				this.allTestResults[paths[index]].status = result;
				this.allTestResults[paths[index]].isRunning = false;
			});

			const resultsForSummary = paths.filter((path) => {
				return !hasOnly ||
					this.allTestResults[path].hasOnly;
			});

			if (resultsForSummary.length !== 0) {
				renderSummary(
					Object.values(this.allTestResults)
						.map((item) => item.status!),
					this.isVerbose
				).lines.forEach((line) => {
					renderLine(line);
				});
			}
		}
	}

	private purgeFile(path: string): Array<string> {
		if (path in this.allTestResults) {
			delete this.allTestResults[path];
		}

		return this.relationships.removeFile(path);
	}

	async addFiles(paths: Array<string>): Promise<boolean> {
		const filteredPaths = paths.filter((path) => this.isTestFile(path));

		if (filteredPaths.length === 0) {
			return false;
		}

		await Promise.all(filteredPaths.map((path) => this.addTestFile(path)));
		await this.runTests(filteredPaths);

		return true;
	}

	async removeFile(path: string): Promise<boolean> {
		if (this.relationships.isCached(path)) {
			if (this.isVerbose) {
				renderLine(
					[['', 'File removed: '], ['group', relative(process.cwd(), path)]]
				);
			}

			const testFiles = this.purgeFile(path);

			if (testFiles.length !== 0) {
				await this.runTests(testFiles);
			}

			return testFiles.length !== 0;
		}

		return false;
	}

	async updateFile(path: string): Promise<boolean> {
		const isChanged = await this.relationships.isContentChanged(path);

		if (!isChanged) {
			return false;
		}

		const isExisting = this.relationships.isCached(path);

		if (this.isTestFile(path)) {
			if (this.isVerbose) {
				renderLine(
					[
						['', isExisting ? 'Test file change detected: ' : 'Test file added: '],
						['group', relative(process.cwd(), path)]
					]
				);
			}

			if (isExisting) {
				this.purgeFile(path);
			}

			return this.addFiles([path]);
		}

		if (isExisting) {
			if (this.isVerbose) {
				renderLine(
					[['', 'File change detected: '], ['group', relative(process.cwd(), path)]]
				);
			}

			const testFiles = this.purgeFile(path);

			return Promise.all(testFiles.map((testFile) => {
					return this.addTestFile(testFile);
				}))
				.then(() => this.addFiles(testFiles));
		}

		return false;
	}

	runAll(): Promise<boolean> {
		const filteredPaths = Object.keys(this.allTestResults);

		return (filteredPaths.length === 0) ?
			Promise.resolve(false) :
			this.runTests(filteredPaths)
				.then(() => true);
	}
}
