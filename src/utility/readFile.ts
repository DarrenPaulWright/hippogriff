// eslint-disable-next-line node/prefer-global/buffer
import { Buffer } from 'node:buffer';
import { readFile as nativeReadFile } from 'node:fs';

const readFile = (path: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		// eslint-disable-next-line node/prefer-promises/fs
		nativeReadFile(path, 'utf8', (error, data) => {
			if (error) {
				reject(error);
			}
			else if (Buffer.isBuffer(data)) {
				resolve(data.toString());
			}
			else {
				resolve(data);
			}
		});
	});
};

export default readFile;
