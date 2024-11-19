import { afterEach, assert, bench, describe, it } from '../index.js';

describe('sample', () => {
	it('should do something', () => {
		assert.equal(2, 1 + 1);
	});

	describe('Addition', () => {
		let count = 0;

		afterEach(() => {
			count = 0;
		});

		bench('plus plus before', () => {
			++count;
		});

		bench('plus plus after', () => {
			count++;
		});

		bench('plus equals', () => {
			count += 1;
		});

		bench('equals plus', () => {
			// eslint-disable-next-line operator-assignment
			count = count + 1;
		});

		bench('Intentional error', () => {
			throw new Error('Error');
		});
	});

	describe('Array concat', () => {
		const first = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const second = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
		let final: Array<number> = [];

		const pushSpread = (): void => {
			final = first.slice();
			final.push(...second);
		};

		const doubleSpread = (): void => {
			final = [...first, ...second];
		};

		const concat = (): void => {
			final = first.concat(second);
		};

		const iteratePush = (): void => {
			final = first.slice();
			second.forEach((item) => {
				final.push(item);
			});
		};

		const testAndBench = (title: string, work: () => void): void => {
			it(`should concat two arrays: ${ title }`, () => {
				work();

				assert.equal(final, [1,
					2,
					3,
					4,
					5,
					6,
					7,
					8,
					9,
					10,
					11,
					12,
					13,
					14,
					15,
					16,
					17,
					18,
					19,
					20]);
			});

			bench(title, work);
		};

		testAndBench('push spread', pushSpread);
		testAndBench('double spread', doubleSpread);
		testAndBench('concat', concat);
		testAndBench('iterate push', iteratePush);
	});

	describe('Async', () => {
		const first = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const second = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
		let final: Array<number> = [];

		bench('async iterate push', () => {
			return new Promise((resolve) => {
				final = first.slice();
				second.forEach((item) => {
					final.push(item);
				});
				resolve();
			});
		});

		bench('Async rejection', () => {
			const temporary = 3;

			return new Promise((resolve, reject) => {
				if (temporary % 2 === 2) {
					resolve();
				}
				else {
					reject(new Error('Error'));
				}
			});
		});
	});
}, {
	benchDuration: false,
	benchDistinctCharts: false,
	benchColors: 'light'
});
