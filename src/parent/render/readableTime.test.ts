import { assert, it } from '../../../index.js';
import readableTime from './readableTime.js';

const testValues: Array<[number, string]> = [
	[1, '1ms'],
	[0.1, '100μs'],
	[0.01, '10μs'],
	[0.001, '1μs'],
	[0.0001, '100ns'],
	[0.00001, '10ns'],
	[100, '100ms'],
	[1000, '1s'],
	[60000, '1m'],
	[3.45678, '3.46ms'],
	[34.5678, '34.6ms'],
	[345.678, '346ms'],
	[3456.789, '3.46s']
];

testValues.forEach((data) => {
	it(`should handle ${ data[0].toLocaleString() }`, () => {
		assert.equal(readableTime(data[0]), data[1]);
	});
});
