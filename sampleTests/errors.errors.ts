/* eslint @typescript-eslint/no-empty-function:off */
import { wait } from 'async-agent';
import { after, afterEach, assert, before, beforeEach, bench, it, when } from '../index.js';

when('Empty work', () => {
	when('Empty describe');

	it('Empty it');

	bench('Empty bench');
});

when('Directly thrown errors', () => {
	when('Empty group', () => {
	});

	when('Error in group', () => {
		throw new Error('Group error');
	});

	it('Error in test', () => {
		throw new Error('Test error');
	});
});

when('Incorrectly nested function Errors', () => {
	it('should handle nested "it" functions', () => {
		it('should break');
	});

	it('should handle a "bench" inside an "it" function', () => {
		bench('should break');
	});

	it('should handle a "describe" inside an "it" function', () => {
		when('should break');
	});

	bench('should handle nested "bench" functions', () => {
		bench('should break');
	});

	bench('should handle an "it" inside a "bench" function', () => {
		it('should break');
	});

	bench('should handle a "describe" inside a "bench" function', () => {
		when('should break');
	});
});

when('Test timeout', () => {
	it('should handle timeout', () => {
		return wait(3000)
			.then(() => {
				assert.is(1, 1);
			});
	});
});

when('Error in test lifecycle hooks', () => {
	when('before group', () => {
		let result = '';

		before(() => {
			assert.is(result, 'before');
		});

		it('should throw error in before', () => {
			result = '+';

			assert.is(result, '+');
		});
	});

	when('beforeEach group', () => {
		let result = '';

		beforeEach(() => {
			assert.is(result, 'beforeEach');
		});

		it('should throw error in beforeEach', () => {
			result = '+';

			assert.is(result, '+');
		});
	});

	when('afterEach group', () => {
		let result = '';

		afterEach(() => {
			assert.is(result, 'afterEach');
		});

		it('should throw error in afterEach', () => {
			result = '+';

			assert.is(result, '+');
		});
	});

	when('after group', () => {
		let result = '';

		after(() => {
			assert.is(result, 'after');
		});

		it('should throw error in after', () => {
			result = '+';

			assert.is(result, '+');
		});
	});
});

when('Error in bench lifecycle hooks', () => {
	when('before group', () => {
		let result = '';

		before(() => {
			assert.is(result, 'before');
		});

		bench('should throw error in before', () => {
			result = '+';

			assert.is(result, '+');
		});
	});

	when('beforeEach group', () => {
		let result = '';

		beforeEach(() => {
			assert.is(result, 'beforeEach');
		});

		bench('should throw error in beforeEach', () => {
			result = '+';

			assert.is(result, '+');
		});
	});

	when('afterEach group', () => {
		let result = '';

		afterEach(() => {
			assert.is(result, 'afterEach');
		});

		bench('should throw error in afterEach', () => {
			result = '+';

			assert.is(result, '+');
		});
	});

	when('after group', () => {
		let result = '';

		after(() => {
			assert.is(result, 'after');
		});

		bench('should throw error in after', () => {
			result = '+';

			assert.is(result, '+');
		});
	});
});
