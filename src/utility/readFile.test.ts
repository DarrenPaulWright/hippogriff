import { assert } from 'type-enforcer';
import { it } from '../../index.js';
import readFile from './readFile.js';

it('should read a file', () => {
	return readFile('./src/utility/readFile.sample.js')
		.then((content) => {
			assert.equal(content, `export const test = true;
`);
		});
});
