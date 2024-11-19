import displayValue from 'display-value';
import type { IAnyResult, RenderLineStructure } from '../../hippogriff.models';

const renderLogs = (data: IAnyResult): Array<Array<RenderLineStructure>> => {
	const output: Array<Array<RenderLineStructure>> = [];

	data.logs.forEach((logs) => {
		output.push([
			['logs', `${ logs.type }: `],
			['logs', logs.data.map((item) => displayValue(item)).join(', ')]
		]);
	});

	if (data.logs.length !== 0) {
		output.push([]);
	}

	return output;
};

export default renderLogs;
