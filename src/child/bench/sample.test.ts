import { setTimeout } from 'node:timers';
import { assert, describe, it } from '../../../index.js';
import type { IBenchSettings } from '../../hippogriff.models.js';
import sample from './sample.js';

const wait = (time: number): Promise<void> => {
	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
};

const benchSettings: IBenchSettings = {
	benchMaxSamples: 100,
	benchMaxDuration: 200,
	skip: false,
	only: false,
	beforeEach: [],
	afterEach: []
};

describe('unknown', () => {
	it('should return false if a function does not return a Promise', () => {
		let count = 0;
		const work = (): void => {
			count++;
		};

		return sample(work, 1, null, benchSettings)
			.then((result) => {
				assert.is(result.isPromise, false);
				assert.is(count, 1);
			});
	});

	it('should return true if a function returns a Promise', () => {
		let count = 0;
		const work = (): Promise<void> => new Promise((resolve) => {
			setTimeout(() => {
				count++;
				resolve();
			}, 0);
		});

		return sample(work, 1, null, benchSettings)
			.then((result) => {
				assert.is(result.isPromise, true);
				assert.is(count, 1);
			});
	});
});

describe('normal function', () => {
	it('should call the work function once if iterations is 1', () => {
		let count = 0;
		const work = (): void => {
			count++;
		};

		return sample(work, 1, false, benchSettings)
			.then((result) => {
				assert.lessThan(result.time, 0.1);
				assert.lessThan(result.duration, 0.1);
				assert.is(result.isPromise, false);
				assert.is(count, 1);
			});
	});

	it('should call the sync work function 10 times if iterations is 10', () => {
		let count = 0;
		const work = (): void => {
			for (let i = 0; i < 1000; i++) {
				count++;
			}
		};

		return sample(work, 10, false, benchSettings)
			.then((result) => {
				assert.moreThan(result.time, 0);
				assert.moreThan(result.duration, 0);
				assert.is(result.isPromise, false);
				assert.is(count, 10000);
			});
	});

	it('should call the beforeEach callback before work is done', () => {
		let count = 0;
		let isCalled = false;
		const work = (): void => {
			count++;
		};

		return sample(work, 1, false, {
			...benchSettings,
			beforeEach: [(): Promise<void> => {
				return new Promise((resolve) => {
					assert.is(count, 0);
					isCalled = true;
					resolve();
				});
			}]
		})
			.then((result) => {
				assert.lessThan(result.time, 0.1);
				assert.is(result.isPromise, false);
				assert.is(count, 1);
				assert.is(isCalled, true);
			});
	});

	it('should call the afterEach callback after work is done', () => {
		let count = 0;
		let isCalled = false;
		const work = (): void => {
			count++;
		};

		return sample(work, 1, false, {
			...benchSettings,
			afterEach: [(): Promise<void> => {
				return new Promise((resolve) => {
					assert.is(count, 1);
					isCalled = true;
					resolve();
				});
			}]
		})
			.then((result) => {
				assert.atLeast(result.time, 0);
				assert.is(result.isPromise, false);
				assert.is(count, 1);
				assert.is(isCalled, true);
			});
	});
});

describe('promise', () => {
	it('should call the work function once if iterations is 1', () => {
		let count = 0;
		const work = (): Promise<void> => wait(20)
			.then(() => {
				count++;
			});

		return sample(work, 1, true, benchSettings)
			.then((result) => {
				assert.moreThan(result.time, 19);
				assert.is(result.isPromise, true);
				assert.is(count, 1);
			});
	});

	it('should call the async work function 10 times if iterations is 10', () => {
		let count = 0;
		const work = (): Promise<void> => wait(20)
			.then(() => {
				count++;
			});

		return sample(work, 10, true, benchSettings)
			.then((result) => {
				assert.is(count, 10);
				assert.moreThan(result.duration, 199);
				assert.moreThan(result.time, 19);
				assert.is(result.isPromise, true);
			});
	});

	it('should call the beforeEach callback before work is done', () => {
		let count = 0;
		let isCalled = false;
		const work = (): Promise<void> => wait(20)
			.then(() => {
				count++;
			});

		return sample(work, 1, true, {
			...benchSettings,
			beforeEach: [(): Promise<void> => {
				return new Promise((resolve) => {
					assert.is(count, 0);
					isCalled = true;
					resolve();
				});
			}]
		})
			.then((result) => {
				assert.moreThan(result.time, 19);
				assert.is(result.isPromise, true);
				assert.is(count, 1);
				assert.is(isCalled, true);
			});
	});

	it('should call the afterEach callback after work is done', () => {
		let count = 0;
		let isCalled = false;
		const work = (): Promise<void> => wait(20)
			.then(() => {
				count++;
			});

		return sample(work, 1, true, {
			...benchSettings,
			afterEach: [(): Promise<void> => {
				return new Promise((resolve) => {
					assert.is(count, 1);
					isCalled = true;
					resolve();
				});
			}]
		})
			.then((result) => {
				assert.moreThan(result.time, 19);
				assert.is(result.isPromise, true);
				assert.is(count, 1);
				assert.is(isCalled, true);
			});
	});
});
