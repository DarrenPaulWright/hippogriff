import { setTimeout } from 'node:timers';
import {
	after,
	afterEach,
	assert,
	before,
	beforeEach,
	bench,
	describe,
	it,
	when
} from '../index.js';

when('Lifecycle hooks', () => {
	let count = 0;
	let result = '';

	after(() => {
		assert.is(result, 'b1.b.be1.be.t1.ae.ae1.a.a1.');
	});

	when('second level', () => {
		before(() => {
			result += 'b1.';
		});

		beforeEach(() => {
			result += 'be1.';
		});

		afterEach(() => {
			result += 'ae1.';
		});

		after(() => {
			result += 'a1.';
		});

		when('third level', () => {
			before(() => {
				result += 'b.';
			});

			beforeEach(() => {
				result += 'be.';
			});

			afterEach(() => {
				result += 'ae.';
			});

			after(() => {
				result += 'a.';
			});

			it('should count', () => {
				count++;

				result += 't1.';

				assert.is(count, 1);
			});

			it.skip('should not count test', () => {
				count++;

				result += 't2.';

				assert.is(count, 0);
			});

			when.skip('skip group', () => {
				it('should not count test', () => {
					count++;

					result += 't3.';

					assert.is(count, 0);
				});
			});
		});
	});

	it('should render more than one second', () => {
		return new Promise<void>((resolve) => {
			setTimeout(resolve, 1050);
		})
			.then(() => {
				assert.is(count, 1);
			});
	});
});

when('inappropriate nested functions', () => {
	it('should throw when it is called in another it', () => {
		let fail = false;

		try {
			it('nested');
			fail = true;
		}
		catch (error) {
			assert.instanceOf(error, Error);
		}

		if (fail) {
			throw new Error('Didn\'t throw');
		}
	});

	it('should throw when describe is called in another it', () => {
		let fail = false;

		try {
			describe('nested');
			fail = true;
		}
		catch (error) {
			assert.instanceOf(error, Error);
		}

		if (fail) {
			throw new Error('Didn\'t throw');
		}
	});

	it('should throw when when is called in another it', () => {
		let fail = false;

		try {
			when('nested');
			fail = true;
		}
		catch (error) {
			assert.instanceOf(error, Error);
		}

		if (fail) {
			throw new Error('Didn\'t throw');
		}
	});

	it('should throw when bench is called in another it', () => {
		let fail = false;

		try {
			bench('nested');
			fail = true;
		}
		catch (error) {
			assert.instanceOf(error, Error);
		}

		if (fail) {
			throw new Error('Didn\'t throw');
		}
	});
});
