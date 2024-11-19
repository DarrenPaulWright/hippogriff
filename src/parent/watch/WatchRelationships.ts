import { dirname, resolve as resolvePath } from 'node:path';
import { parseImports } from 'parse-imports';
import type ReadFile from '../../utility/readFile.js';
import renderError from '../render/renderError.js';
import renderLine from '../render/renderLine.js';

export default class WatchRelationships {
	private testsImpactedByFile: { [path: string]: Array<string> } = {};
	private fileImports: { [path: string]: Array<string> } = {};
	private fileContents: { [path: string]: string } = {};

	constructor(readFile: typeof ReadFile) {
		this.readFile = readFile;
	}

	// eslint-disable-next-line @typescript-eslint/class-methods-use-this
	private readFile: typeof ReadFile = () => Promise.resolve('');

	private async getImports(path: string): Promise<Array<string>> {
		if (this.isCached(path)) {
			return Promise.resolve(this.fileImports[path]);
		}

		const contents = await this.readFile(path);
		this.fileContents[path] = contents;
		const importIterator = await parseImports(contents);
		const directory = dirname(path);

		if (!(path in this.fileImports)) {
			this.fileImports[path] = [];
		}

		[...importIterator].forEach((info) => {
			const importPath = info.moduleSpecifier?.value;
			const type = info.moduleSpecifier?.type;

			if ((type === 'relative' || type === 'absolute') &&
				!importPath?.includes('node_modules')) {
				const fullImportPath = resolvePath(directory, importPath!);

				if (!this.fileImports[path].includes(fullImportPath)) {
					this.fileImports[path].push(fullImportPath);
				}
			}
		});

		return this.fileImports[path];
	}

	async isContentChanged(path: string): Promise<boolean> {
		const contents = await this.readFile(path);
		const isChanged = this.fileContents[path] !== contents;
		this.fileContents[path] = contents;

		return isChanged;
	}

	async addTestFile(testFilePath: string): Promise<void> {
		const load = (path: string): Promise<void> => {
			return this.getImports(path)
				.then((imports) => {
					return Promise.all(imports.map((importPath) => {
						if (!(importPath in this.testsImpactedByFile)) {
							this.testsImpactedByFile[importPath] = [];
						}

						if (
							!this.testsImpactedByFile[importPath]
								.includes(testFilePath)
						) {
							this.testsImpactedByFile[importPath].push(testFilePath);
						}

						return load(importPath);
					}));
				})
				// eslint-disable-next-line @typescript-eslint/no-empty-function
				.then((): void => {
				})
				.catch((error) => {
					renderError(error as Error)
						.forEach((line) => {
							renderLine(line);
						});
				});
		};

		return load(testFilePath);
	}

	removeFile(path: string): Array<string> {
		const originalTestFiles = this.testsImpactedByFile[path] ?? [];

		if (path in this.fileImports) {
			delete this.fileImports[path];
		}

		if (path in this.testsImpactedByFile) {
			delete this.testsImpactedByFile[path];
		}

		if (path in this.fileContents) {
			delete this.fileContents[path];
		}

		Object.values(this.testsImpactedByFile)
			.forEach((files) => {
				const index = files.indexOf(path);

				if (index !== -1) {
					files.splice(index, 1);
				}
			});

		return originalTestFiles;
	}

	isCached(path: string): boolean {
		return path in this.fileImports;
	}
}
