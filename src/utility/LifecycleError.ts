export default class LifecycleError extends Error {
	constructor(message: string) {
		super(message);

		this.name = 'LifecycleError';
	}
}
