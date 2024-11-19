import type {
	IAnyResult,
	IBenchResult,
	IDescribe,
	IGroupResult,
	IInternalWork,
	ILog,
	ITestResult
} from '../hippogriff.models';
import sequence from '../utility/async/sequence.js';
import canRun from '../utility/process/canRun.js';
import processGroupResults from '../utility/process/processGroupResults.js';
import baseDescribe from './baseDescribe.js';
import logs from './logs.js';

let start = 0;

const getFiller = (work: IInternalWork): ITestResult | IBenchResult => {
	if (work.type === 'test') {
		return {
			type: 'test',
			title: '',
			isSkipped: work.skip,
			error: false,
			duration: 0,
			settings: {
				...baseDescribe.settings,
				index: work.index
			},
			logs: []
		};
	}

	return {
		type: 'bench',
		title: '',
		isSkipped: work.skip,
		error: false,
		remainingSamples: 0,
		iterations: 0,
		samples: [],
		cycles: 0,
		duration: 0,
		isPromise: null,
		settings: {
			...baseDescribe.settings,
			index: work.index
		},
		logs: []
	};
};

const processDescribe = (
	hasOnly: () => boolean,
	data: IDescribe,
	onUpdate: (result: IGroupResult) => void,
	groupIndex: number,
	startTestIndex?: number
): IInternalWork => {
	if (startTestIndex !== undefined) {
		start = startTestIndex;
	}

	const internalWork: IInternalWork = {
		type: 'group',
		index: data.settings.index,
		skip: data.settings.skip,
		work: (resolve): void => {
			const getLogs = (): Array<ILog> => {
				return groupIndex === 0 ?
					logs.purge() :
					logs.pop();
			};

			if (internalWork.error) {
				const output = processGroupResults(
					data,
					[],
					false,
					getLogs(),
					internalWork.error
				);

				onUpdate(output);
				resolve(output);
			}
			else {
				let results: Array<IAnyResult> = [];

				logs.tag(`describe_${ groupIndex }`);

				const skipLifeCycle = data.settings.skip ||
					data.lifeCycle.work.every((child) => child.skip);

				sequence(skipLifeCycle ? [] : data.lifeCycle.before)
					.then(() => {
						return sequence<IAnyResult>(
							data.lifeCycle.work.map((item) => (): Promise<IAnyResult> => {
								const output = item.type === 'group' || item.index >= start ?
									new Promise(item.work) :
									Promise.resolve(getFiller(item));

								return output;
							})
						);
					})
					.then((output) => {
						results = output;

						return sequence(skipLifeCycle ? [] : data.lifeCycle.after);
					})
					.then(() => {
						const isSkipped = !canRun(hasOnly(), data.settings) ||
							results.every((result) => result.isSkipped);

						const output = processGroupResults(data, results, isSkipped, getLogs());

						onUpdate(output);
						resolve(output);
					})
					.catch((error) => {
						const output = processGroupResults(
							data,
							[],
							false,
							getLogs(),
							error as Error
						);

						onUpdate(output);
						resolve(output);
					});
			}
		}
	};

	return internalWork;
};

export default processDescribe;
