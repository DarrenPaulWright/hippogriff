import stripAnsi from 'strip-ansi';
import getDiff from '../../diff/getDiff.js';
import type { IAssertionError, RenderLineStructure } from '../../hippogriff.models';
import renderFileFromStack from './renderFileFromStack.js';

const RENDER_SIZE_THRESHOLD = 3;

const canDiff = (error: Error): error is IAssertionError => {
	return (!('showDiff' in error) || error.showDiff as boolean) &&
		('expected' in error && 'actual' in error);
};

const shouldRenderDiff = (diff: ReturnType<typeof getDiff>): boolean => {
	return (diff.length > 1 && diff[0].length > 1 && diff[1].length > 1) ||
		(diff[0]?.[0]?.[1]?.length || 0) > RENDER_SIZE_THRESHOLD ||
		(diff[1]?.[0]?.[1]?.length || 0) > RENDER_SIZE_THRESHOLD;
};

const renderError = (
	error: Error | false,
	title = ''
): Array<Array<RenderLineStructure>> => {
	const output: Array<Array<RenderLineStructure>> = [];

	if (error !== false) {
		output.push(
			renderFileFromStack(error, title),
			[[
				'error',
				stripAnsi((error.message) ?? 'No error message')
			]]
		);

		if (
			error.name !== 'AssertionError' &&
			error.name !== 'LifecycleError' &&
			!error.stack?.startsWith('AssertionError') &&
			error.stack
		) {
			output.push(
				[[
					'',
					error.stack
				]]
			);
		}

		if (canDiff(error)) {
			const diff = getDiff(error.expected, error.actual);

			if (shouldRenderDiff(diff)) {
				output.push([], ...diff);
			}
		}

		output.push([]);
	}

	return output;
};

export default renderError;
