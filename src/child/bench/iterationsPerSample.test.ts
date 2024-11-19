import { assert, it } from '../../../index.js';
import iterationsPerSample, { ITERATION_MODIFIER } from './iterationsPerSample.js';

it(`should return ${ ITERATION_MODIFIER } for an empty array`, () => {
	assert.equal(iterationsPerSample([]), ITERATION_MODIFIER);
});

it(`should return 2 if the mean is ${ ITERATION_MODIFIER / 2 }`, () => {
	assert.equal(iterationsPerSample([ITERATION_MODIFIER / 2]), 2);
});

it(`should return 1 if the mean is ${ ITERATION_MODIFIER }`, () => {
	assert.equal(iterationsPerSample([ITERATION_MODIFIER]), 1);
});

it('should return 1 if the mean is greater than the max duration', () => {
	assert.equal(iterationsPerSample([10000]), 1);
});

it('should only consider the last three durations', () => {
	assert.equal(iterationsPerSample([300, 1, 1, 1]), ITERATION_MODIFIER);
});
