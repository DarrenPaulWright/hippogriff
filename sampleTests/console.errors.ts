/* eslint no-console: off */
import { after, afterEach, assert, before, beforeEach, it, when } from '../index.js';

when('Intentionally empty parent group', () => {
	console.log('Empty parent group', 'second arg');

	when('Normal assertion failures with console logs', () => {
		console.log('Parent group');

		before(() => {
			console.log('Parent "before" hook');
		});

		after(() => {
			console.log('Parent "after" hook');
		});

		it('should handle single assertion failure', () => {
			console.log('First assertion failure.');

			const result = '+';

			assert.is(result, '-');
		});

		when('nested to test console logs', () => {
			console.log('Child group');

			before(() => {
				console.log('Child "before" hook');
			});

			beforeEach(() => {
				console.log('Child "beforeEach" hook');
			});

			after(() => {
				console.log('Child "after" hook');
			});

			afterEach(() => {
				console.log('Child "afterEach" hook');
			});

			it('should handle multiple assertion failures', () => {
				const result = '+';

				assert.is(result, '-');
				assert.is(result, '1');
			});
		});
	});
});
