const sequence = <OutType>(
	promises: Array<() => Promise<OutType>>
): Promise<Array<OutType>> => {
	return new Promise((resolve, reject) => {
		const output: Array<OutType> = [];

		const next = (index: number): void => {
			if (index < promises.length) {
				promises[index]()
					.then((result) => {
						output[index] = result;
					})
					.then(() => {
						next(index + 1);
					})
					.catch(reject);
			}
			else {
				resolve(output);
			}
		};

		next(0);
	});
};

export default sequence;
