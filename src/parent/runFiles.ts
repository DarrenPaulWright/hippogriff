import type { IGroupResult } from '../hippogriff.models';
import RunFile from './RunFile.js';

const runFiles = (
	paths: Array<string>,
	isVerbose: boolean,
	hasOnlyCallback?: (results: Array<RunFile>) => [boolean, boolean]
): Promise<Array<IGroupResult>> => {
	const children = paths.map((path) => new RunFile(path, isVerbose));

	return Promise.all(children.map((child) => child.onReady()))
		.then(() => {
			let skipTests = false;
			let hasOnly = false;

			if (hasOnlyCallback) {
				[hasOnly, skipTests] = hasOnlyCallback(children);
			}
			else {
				hasOnly = children.some((child) => child.hasOnly);
			}

			return skipTests ?
				Promise.resolve([]) :
				Promise.all(children.map((child) => child.run(hasOnly)));
		});
};

export default runFiles;
