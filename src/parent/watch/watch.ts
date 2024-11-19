import globParent from 'glob-parent';
import nodeWatch from 'node-watch';
import { stat } from 'node:fs';
import { join, normalize } from 'node:path';
import readFile from '../../utility/readFile.js';
import renderError from '../render/renderError.js';
import renderLine from '../render/renderLine.js';
import WatchCache from './WatchCache.js';
import watchKeyPress from './watchKeyPress.js';

const catchError = (error: Error): void => {
	renderError(error, 'Error running tests: ')
		.forEach((line) => {
			renderLine(line);
		});
};

const watching = (didTestsRun: boolean): void => {
	if (didTestsRun) {
		renderLine(
			[
				['', 'Watching for changes… '],
				['subText', '(ctrl + c or esc to exit, space to rerun all tests)']
			]
		);
	}
};

const watch = (
	__dirname: string,
	filesGlob: string,
	files: Array<string>,
	isVerbose: boolean
): void => {
	const watchedDirectory = join(__dirname, globParent(filesGlob));
	const cache = new WatchCache(filesGlob, isVerbose, readFile);

	const startWatching = (): void => {
		watching(true);

		nodeWatch(
			watchedDirectory,
			{ recursive: true },
			(eventType, fileName) => {
				if (eventType === 'remove') {
					cache.removeFile(normalize(fileName))
						.then(watching)
						.catch(catchError);
				}
				else {
					// eslint-disable-next-line node/prefer-promises/fs
					stat(fileName, (error, stats) => {
						if (!error && stats.isFile()) {
							cache.updateFile(normalize(fileName))
								.then(watching)
								.catch(catchError);
						}
					});
				}
			}
		);
	};

	watchKeyPress(() => {
		cache.runAll()
			.then(watching)
			.catch(catchError);
	});

	cache.addFiles(files.map((file) => normalize(file)))
		.then(() => {
			startWatching();
		})
		.catch(catchError);
};

export default watch;
