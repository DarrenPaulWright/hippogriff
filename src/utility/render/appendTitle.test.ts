import { assert } from 'type-enforcer';
import { it } from '../../../index.js';
import appendTitle from './appendTitle.js';

it('should not add a colon if the first string is empty', () => {
	assert.equal(appendTitle('', 'do something'), 'do something');
});

it('should add a colon if the first string is not empty', () => {
	assert.equal(
		appendTitle('first', 'do something'),
		'first ● do something'
	);
});
