const get = (object: unknown, path: string): unknown => {
	let output = object;

	path.split('.').some((key) => {
		output = (output === undefined || output === null) ?
			undefined :
			(output as { [key: string]: unknown })[key];

		return output === undefined;
	});

	return output;
};

const sum = (
	array: Array<unknown>,
	key?: string
): number => {
	if (key) {
		return array.reduce<number>((result: number, item) => {
			return result + (get(item, key) as number || 0);
		}, 0);
	}

	return array.reduce<number>((result, item) => result + (item as number || 0), 0);
};

export default sum;
