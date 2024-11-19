import { assert, it } from '../../index.js';
import diffNumber from './diffNumber.js';

it('should align decimals if actual has fewer regular digits', () => {
	const result = diffNumber(112.2, 1.956);

	assert.equal(result, [[
		['removedRow', '1'],
		['removed', '12'],
		['removedRow', '.'],
		['removed', '2']
	], [
		['addedRow', '  '],
		['addedRow', '1'],
		['addedRow', '.'],
		['added', '956']
	]]);
});

it('should align decimals if expected has fewer regular digits', () => {
	const result = diffNumber(2.2, 12345.95634);

	assert.equal(result, [[
		['removedRow', '     '],
		['removedRow', '2'],
		['removedRow', '.'],
		['removed', '2']
	], [
		['added', '1'],
		['addedRow', '2'],
		['added', ',345'],
		['addedRow', '.'],
		['added', '95634']
	]]);
});

it('should align decimals if expected has no decimal and actual has more regular than expected', () => {
	const result = diffNumber(22, 12345.95634);

	assert.equal(result, [[
		['removedRow', '    '],
		['removedRow', '2'],
		['removed', '2']
	], [
		['added', '1'],
		['addedRow', '2'],
		['added', ',345.95634']
	]]);
});

it('should align decimals if expected has no decimal and expected has more regular than actual', () => {
	const result = diffNumber(12345, 22.95634);

	assert.equal(result, [[
		['removed', '1'],
		['removedRow', '2'],
		['removed', ','],
		['removedRow', '34'],
		['removed', '5']
	], [
		['addedRow', '    '],
		['addedRow', '2'],
		['added', '2.956'],
		['addedRow', '34']
	]]);
});

it('should align decimals if actual has no decimal and expected has more regular than actual', () => {
	const result = diffNumber(12345.95634, 22);

	assert.equal(result, [[
		['removed', '1'],
		['removedRow', '2'],
		['removed', ',345.95634']
	], [
		['addedRow', '    '],
		['addedRow', '2'],
		['added', '2']
	]]);
});

it('should align decimals if actual has no decimal and actual has more regular than expected', () => {
	const result = diffNumber(22.95634, 12345);

	assert.equal(result, [[
		['removedRow', '    '],
		['removed', '2'],
		['removedRow', '2'],
		['removed', '.956'],
		['removedRow', '34']
	], [
		['added', '1'],
		['addedRow', '2'],
		['added', ','],
		['addedRow', '34'],
		['added', '5']
	]]);
});

it('should align decimals if neither has a decimal', () => {
	const result = diffNumber(22, 12345);

	assert.equal(result, [[
		['removedRow', '    '],
		['removedRow', '2'],
		['removed', '2']
	], [
		['added', '1'],
		['addedRow', '2'],
		['added', ',345']
	]]);
});

it('should not align if both have same regular digits', () => {
	const result = diffNumber(22222, 12345);

	assert.equal(result, [[
		['removed', '2'],
		['removedRow', '2,'],
		['removed', '222']
	], [
		['added', '1'],
		['addedRow', '2,'],
		['added', '345']
	]]);
});
