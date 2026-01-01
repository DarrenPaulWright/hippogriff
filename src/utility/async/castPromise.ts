import { isFunction, isPromise } from 'type-enforcer';

const castPromise = <T>(work: Promise<T> | (() => (Promise<T> | T)) | T): Promise<T> => {
	if (isPromise(work)) {
		return work;
	}

	if (isFunction(work)) {
		return new Promise((resolve, reject) => {
			try {
				const result = (work as () => (Promise<T> | T))();

				resolve(result);
			}
			catch (error) {
				reject(error as Error);
			}
		});
	}

	return Promise.resolve(work);
};

export default castPromise;
