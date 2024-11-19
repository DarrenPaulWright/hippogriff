const median = (durations: Array<number>): number => {
	const length = durations.length;

	if (length === 0) {
		return 0;
	}

	const mid = (length - 1) / 2;

	durations.sort();

	return length % 2 === 0 ?
		(
			(durations[Math.floor(mid)]) +
			(durations[Math.ceil(mid)])
		) / 2 :
		durations[mid];
};

export default median;
