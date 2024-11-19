import { clone } from 'object-agent';
import { assert, beforeEach, describe, it } from '../../index.js';
import { testDescribe, testLifeCycle, testTestResult } from '../../sampleTests/testData.helper.js';
import type { IGroupResult } from '../hippogriff.models';
import processDescribe from './processDescribe.js';

const baseParams: Parameters<typeof processDescribe> = [
	(): boolean => false,
	testDescribe,
	(): void => {
	},
	0
];

describe('processDescribe', () => {
	let params: Parameters<typeof processDescribe> = baseParams;

	beforeEach(() => {
		params = clone(baseParams) as Parameters<typeof processDescribe>;
	});

	describe('run describe', () => {
		it('should run a describe with no work', () => {
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then((response) => {
					const output = response as IGroupResult;

					assert.is(internalWork.type, 'group');
					assert.is(internalWork.skip, false);

					assert.is(output.type, 'group');
					assert.is(output.title, 'processDescribe.test.js');
					assert.is(output.isSkipped, true);
					assert.is(output.error, false);
					assert.equal(output.logs, []);
				});
		});

		it('should capture a console log', () => {
			params[1].lifeCycle.work = [{
				type: 'test',
				index: 0,
				skip: false,
				work: (resolve): void => {
					// eslint-disable-next-line no-console
					console.log('banana');

					resolve(testTestResult());
				}
			}];

			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then((response) => {
					const output = response as IGroupResult;

					assert.is(internalWork.type, 'group');
					assert.is(internalWork.skip, false);

					assert.is(output.type, 'group');
					assert.is(output.title, 'processDescribe.test.js');
					assert.is(output.isSkipped, false);
					assert.is(output.error, false);
					assert.equal(output.logs, [{
						tag: 'describe_0',
						type: 'log',
						data: ['banana']
					}]);
				});
		});

		it('should capture an error', () => {
			params[1].lifeCycle.work = [{
				type: 'test',
				index: 0,
				skip: false,
				work: (resolve): void => {
					assert.is(1, 2);

					resolve(testTestResult());
				}
			}];

			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then((response) => {
					const output = response as IGroupResult;

					assert.is(internalWork.type, 'group');
					assert.is(internalWork.skip, false);

					assert.is(output.type, 'group');
					assert.is(output.title, 'processDescribe.test.js');
					assert.is(output.isSkipped, false);
					assert.is(
						(output.error as Error)?.message,
						'expected 1 to be 2'
					);
				});
		});
	});

	describe('lifeCycle hooks', () => {
		it('should run before and after', () => {
			let lifeCycleOutput = '';

			params[1] = {
				...testDescribe,
				lifeCycle: {
					...testLifeCycle(),
					before: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'Before';

						resolve();
					})],
					after: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'After';

						resolve();
					})],
					work: [{
						type: 'test',
						index: 0,
						skip: false,
						work: (resolve): void => {
							resolve(testTestResult());
						}
					}]
				},
				settings: {
					...testDescribe.settings,
					skip: false
				}
			};
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then(() => {
					assert.is(lifeCycleOutput, 'BeforeAfter');
				});
		});

		it('should not run before and after if skipped', () => {
			let lifeCycleOutput = '';

			params[1] = {
				...testDescribe,
				lifeCycle: {
					...testLifeCycle(),
					before: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'Before';

						resolve();
					})],
					after: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'After';

						resolve();
					})],
					work: [{
						type: 'test',
						index: 0,
						skip: false,
						work: (resolve): void => {
							resolve(testTestResult());
						}
					}]
				},
				settings: {
					...testDescribe.settings,
					skip: true
				}
			};
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then(() => {
					assert.is(lifeCycleOutput, '');
				});
		});

		it('should not run before and after if work is empty', () => {
			let lifeCycleOutput = '';

			params[1] = {
				...testDescribe,
				lifeCycle: {
					...testLifeCycle(),
					before: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'Before';

						resolve();
					})],
					after: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'After';

						resolve();
					})]
				},
				settings: {
					...testDescribe.settings,
					skip: false
				}
			};
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then(() => {
					assert.is(lifeCycleOutput, '');
				});
		});

		it('should not run before and after if all work is skipped', () => {
			let lifeCycleOutput = '';

			params[1] = {
				...testDescribe,
				lifeCycle: {
					...testLifeCycle(),
					before: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'Before';

						resolve();
					})],
					after: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'After';

						resolve();
					})],
					work: [{
						type: 'test',
						index: 0,
						skip: true,
						work: (resolve): void => {
							resolve({
								...testTestResult(),
								isSkipped: true
							});
						}
					}, {
						type: 'test',
						index: 1,
						skip: true,
						work: (resolve): void => {
							resolve({
								...testTestResult(),
								isSkipped: true
							});
						}
					}, {
						type: 'test',
						index: 2,
						skip: true,
						work: (resolve): void => {
							resolve({
								...testTestResult(),
								isSkipped: true
							});
						}
					}]
				},
				settings: {
					...testDescribe.settings,
					skip: false
				}
			};
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then((response) => {
					const output = response as IGroupResult;

					assert.is(output.isSkipped, true);
					assert.is(
						output.error,
						false
					);
					assert.is(lifeCycleOutput, '');
				});
		});

		it('should run before and after if some work is skipped', () => {
			let lifeCycleOutput = '';

			params[1] = {
				...testDescribe,
				lifeCycle: {
					...testLifeCycle(),
					before: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'Before';

						resolve();
					})],
					after: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'After';

						resolve();
					})],
					work: [{
						type: 'test',
						index: 0,
						skip: true,
						work: (resolve): void => {
							resolve(testTestResult());
						}
					}, {
						type: 'test',
						index: 1,
						skip: false,
						work: (resolve): void => {
							resolve(testTestResult());
						}
					}, {
						type: 'test',
						index: 2,
						skip: true,
						work: (resolve): void => {
							resolve(testTestResult());
						}
					}]
				},
				settings: {
					...testDescribe.settings,
					skip: false
				}
			};
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then((response) => {
					const output = response as IGroupResult;

					assert.is(
						output.error,
						false
					);
					assert.is(lifeCycleOutput, 'BeforeAfter');
				});
		});

		it('should catch an error in before hook', () => {
			let lifeCycleOutput = '';

			params[1] = {
				...testDescribe,
				lifeCycle: {
					...testLifeCycle(),
					before: [(): Promise<void> => new Promise(() => {
						lifeCycleOutput += 'Before';
						throw new Error('Error in before');
					})],
					after: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'After';

						resolve();
					})],
					work: [{
						type: 'test',
						index: 0,
						skip: false,
						work: (resolve): void => {
							resolve(testTestResult());
						}
					}]
				},
				settings: {
					...testDescribe.settings,
					skip: false
				}
			};
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then((response) => {
					const output = response as IGroupResult;

					assert.is(output.type, 'group');
					assert.is(output.title, 'processDescribe.test.js');
					assert.is(output.isSkipped, false);
					assert.is(
						(output.error as Error)?.message,
						'Error in before'
					);
					assert.is(lifeCycleOutput, 'Before');
				});
		});

		it('should catch an error in after hook', () => {
			let lifeCycleOutput = '';

			params[1] = {
				...testDescribe,
				lifeCycle: {
					...testLifeCycle(),
					before: [(): Promise<void> => new Promise((resolve) => {
						lifeCycleOutput += 'Before';

						resolve();
					})],
					after: [(): Promise<void> => new Promise(() => {
						lifeCycleOutput += 'After';
						throw new Error('Error in after');
					})],
					work: [{
						type: 'test',
						index: 0,
						skip: false,
						work: (resolve): void => {
							resolve(testTestResult());
						}
					}]
				},
				settings: {
					...testDescribe.settings,
					skip: false
				}
			};
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then((response) => {
					const output = response as IGroupResult;

					assert.is(output.type, 'group');
					assert.is(output.title, 'processDescribe.test.js');
					assert.is(output.isSkipped, false);
					assert.is(
						(output.error as Error)?.message,
						'Error in after'
					);
					assert.is(lifeCycleOutput, 'BeforeAfter');
				});
		});
	});

	describe('cannot run', () => {
		it('should skip a test marked as skip', () => {
			params[1] = {
				...testDescribe,
				settings: {
					...testDescribe.settings,
					skip: true
				}
			};
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then((response) => {
					const output = response as IGroupResult;

					assert.is(internalWork.type, 'group');
					assert.is(internalWork.skip, true);

					assert.is(output.type, 'group');
					assert.is(output.isSkipped, true);
					assert.is(output.error, false);
				});
		});

		it('should skip a test if hasOnly returns true and no only', () => {
			params[0] = (): boolean => true;
			params[1] = {
				...testDescribe,
				settings: {
					...testDescribe.settings,
					skip: false
				}
			};
			const internalWork = processDescribe(...params);

			return new Promise(internalWork.work)
				.then((response) => {
					const output = response as IGroupResult;

					assert.is(internalWork.type, 'group');
					assert.is(internalWork.skip, false);

					assert.is(output.type, 'group');
					assert.is(output.isSkipped, true);
					assert.is(output.error, false);
				});
		});
	});
});
