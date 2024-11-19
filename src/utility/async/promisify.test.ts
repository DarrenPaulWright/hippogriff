import { assert, it, when } from '../../../index.js';
import promisify from './promisify.js';

when('Sync', () => {
	it('should execute a function', () => {
		let count = 0;

		return promisify(() => {
			count++;
		})
			.then(() => {
				assert.is(count, 1);
			});
	});

	it('should catch an error', () => {
		let count = 0;

		return promisify(() => {
			count++;
			throw new Error('Error');
		})
			.then(() => {
				assert.is(count, 2);
			})
			.catch((error) => {
				assert.is(count, 1);
				assert.is(error.message, 'Error');
			});
	});
});

when('Async', () => {
	it('should execute a function', () => {
		let count = 0;

		return promisify(() => {
			return new Promise((resolve) => {
				count++;

				resolve(1);
			});
		})
			.then(() => {
				assert.is(count, 1);
			});
	});

	it('should catch an error', () => {
		let count = 0;

		return promisify(() => {
			return new Promise((resolve, reject) => {
				if (count === 1) {
					resolve(1);
				}
				else {
					count++;

					reject(new Error('Error'));
				}
			});
		})
			.then(() => {
				assert.is(count, 2);
			})
			.catch((error) => {
				assert.is(count, 1);
				assert.is(error.message, 'Error');
			});
	});
});
