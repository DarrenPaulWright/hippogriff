import { Command } from 'commander';
import { glob } from 'glob';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import renderError from './parent/render/renderError.js';
import renderLine from './parent/render/renderLine.js';
import renderSummary from './parent/render/renderSummary.js';
import runFiles from './parent/runFiles.js';
import watch from './parent/watch/watch.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const program = new Command();
let filesGlob = '';

program
	.option('-v, --verbose', 'Output everything while running tests.')
	.option('-w, --watch', 'Watch files for changes and rerun.')
	.argument('[path]', 'Glob path for files to run.', '**/*.test.js')
	.action((path: string) => {
		filesGlob = path;
	});

program.parse(process.argv);

const options = program.opts();
const isVerbose = options.verbose === true;

const singleRun = (files: Array<string>): void => {
	runFiles(files, isVerbose)
		.then((results) => {
			const { passed, errors, lines } = renderSummary(results, isVerbose);

			lines.forEach((line) => {
				renderLine(line);
			});

			process.exit((errors !== 0 || passed === 0) ? -1 : 0);
		})
		.catch((error) => {
			renderError(error as Error, 'Error running tests: ')
				.forEach((line) => {
					renderLine(line);
				});
		});
};

glob(filesGlob, { ignore: 'node_modules/**', absolute: true })
	.then((files) => {
		if (isVerbose) {
			files.forEach((fileName) => {
				renderLine(
					[['', 'File found: '], ['group', relative(process.cwd(), fileName)]]
				);
			});

			if (files.length !== 0) {
				renderLine();
			}
		}

		if (files.length === 0) {
			renderLine([['error', `No files found matching ${ filesGlob }`]]);
			renderLine();
		}

		if (options.watch) {
			watch(__dirname, filesGlob, files, isVerbose);
		}
		else if (files.length === 0) {
			process.exit(-1);
		}
		else {
			singleRun(files);
		}
	})
	.catch(((error) => {
		renderError(error as Error)
			.forEach((line) => {
				renderLine(line);
			});
	}));
