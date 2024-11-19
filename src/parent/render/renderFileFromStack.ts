import { relative } from 'node:path';
import type { RenderLineStructure } from '../../hippogriff.models';

const renderFileFromStack = (
	error: Error,
	title: string
): Array<RenderLineStructure> => {
	const type = `${ title }${ error.name || 'Error' }`;
	const stack = error.stack!;

	if (stack && error.name !== 'LifecycleError') {
		const index = stack.indexOf('file:') + 8;
		let fileName = stack.slice(index, stack.indexOf('\n', index));
		const lineNumber = fileName.slice(fileName.indexOf(':', 3));

		fileName = fileName.slice(0, fileName.indexOf(':', 3));

		return [
			['', type],
			['subText', ' in '],
			['group', relative(process.cwd(), fileName)],
			['stats', lineNumber]
		];
	}

	return [['', type]];
};

export default renderFileFromStack;
