import { clone } from 'object-agent';
import { assert, beforeEach, describe, it } from '../../index.js';
import {
	testDescribe,
	testInternalSettings,
	testTimeoutHooks
} from '../../sampleTests/testData.helper.js';
import type { ITestResult } from '../hippogriff.models';
import processIt from './processIt.js';

const baseParams: Parameters<typeof processIt> = [
	'Test test',
	(): boolean => false,
	testInternalSettings(),
	(): void => {
	},
	testTimeoutHooks
];

describe('run test', () => {
	let params: Parameters<typeof processIt> = baseParams;

	beforeEach(() => {
		params = clone(baseParams) as Parameters<typeof processIt>;
	});

	it('should run a test', () => {
		const internalWork = processIt(...params);

		return new Promise(internalWork.work)
			.then((response) => {
				const output = response as ITestResult;

				assert.is(internalWork.type, 'test');
				assert.is(internalWork.skip, false);

				assert.is(output.type, 'test');
				assert.is(output.title, 'Test test');
				assert.is(output.isSkipped, false);
				assert.is(output.error, false);
				assert.moreThan(output.duration, 0);
			});
	});

	it('should capture a console log', () => {
		params[3] = (): void => {
			// eslint-disable-next-line no-console
			console.log('banana');
		};

		const internalWork = processIt(...params);

		return new Promise(internalWork.work)
			.then((response) => {
				const output = response as ITestResult;

				assert.is(internalWork.type, 'test');
				assert.is(internalWork.skip, false);

				assert.is(output.type, 'test');
				assert.is(output.title, 'Test test');
				assert.is(output.isSkipped, false);
				assert.is(output.error, false);
				assert.equal(output.logs, [{
					tag: 'test',
					type: 'log',
					data: ['banana']
				}]);
				assert.moreThan(output.duration, 0);
			});
	});

	it('should capture an error', () => {
		params[3] = (): void => {
			assert.is(1, 2);
		};

		const internalWork = processIt(...params);

		return new Promise(internalWork.work)
			.then((response) => {
				const output = response as ITestResult;

				assert.is(internalWork.type, 'test');
				assert.is(internalWork.skip, false);

				assert.is(output.type, 'test');
				assert.is(output.title, 'Test test');
				assert.is(output.isSkipped, false);
				assert.is(
					(output.error as Error)?.message,
					'expected 1 to be 2'
				);
				assert.moreThan(output.duration, 0);
			});
	});

	it('should call timeout hooks', () => {
		let renderOrder = '';
		params[4] = {
			onStart: (): void => {
				renderOrder += 'Start';
			},
			onStop: (): void => {
				renderOrder += 'Stop';
			},
			onUpdate: (): void => {
				renderOrder += 'Update';
			}
		};

		const internalWork = processIt(...params);

		return new Promise(internalWork.work)
			.then(() => {
				assert.is(renderOrder, 'StartStopUpdate');
			});
	});

	it('should call beforeEach and afterEach');
});

describe('cannot run', () => {
	it('should skip a test marked as skip', () => {
		let lifecycle = '';
		const params: Parameters<typeof processIt> = [...baseParams];
		params[2] = {
			...testDescribe.settings,
			parent: {
				...testDescribe,
				lifeCycle: {
					...testDescribe.lifeCycle,
					beforeEach: [(): Promise<void> => {
						return new Promise((resolve) => {
							lifecycle += 'beforeEach';
							resolve();
						});
					}],
					afterEach: [(): Promise<void> => {
						return new Promise((resolve) => {
							lifecycle += 'afterEach';
							resolve();
						});
					}]
				}
			},
			skip: true
		};
		const internalWork = processIt(...params);

		return new Promise(internalWork.work)
			.then((response) => {
				const output = response as ITestResult;

				assert.is(lifecycle, '');
				assert.is(internalWork.type, 'test');
				assert.is(internalWork.skip, true);

				assert.is(output.type, 'test');
				assert.is(output.isSkipped, true);
				assert.is(output.error, false);
				assert.is(output.duration, 0);
			});
	});

	it('should skip a test if hasOnly returns true and no only', () => {
		let lifecycle = '';
		const params: Parameters<typeof processIt> = [...baseParams];
		params[1] = (): boolean => true;
		params[2] = {
			...testDescribe.settings,
			parent: {
				...testDescribe,
				lifeCycle: {
					...testDescribe.lifeCycle,
					beforeEach: [(): Promise<void> => {
						return new Promise((resolve) => {
							lifecycle += 'beforeEach';
							resolve();
						});
					}],
					afterEach: [(): Promise<void> => {
						return new Promise((resolve) => {
							lifecycle += 'afterEach';
							resolve();
						});
					}]
				}
			},
			only: false
		};
		const internalWork = processIt(...params);

		return new Promise(internalWork.work)
			.then((response) => {
				const output = response as ITestResult;

				assert.is(lifecycle, '');
				assert.is(internalWork.type, 'test');
				assert.is(internalWork.skip, false);

				assert.is(output.type, 'test');
				assert.is(output.isSkipped, true);
				assert.is(output.error, false);
				assert.is(output.duration, 0);
			});
	});
});
