export default (
	samples: Array<number>,
	iterations: number,
	maxSamples: number,
	maxDuration: number,
	duration: number
): number => {
	if (samples.length === 0) {
		return maxSamples;
	}

	const estimatedSampleLength = iterations * samples[samples.length - 1];
	const remainingTime = maxDuration - duration;

	return Math.min(
		maxSamples - samples.length,
		Math.max(0, Math.ceil(remainingTime / estimatedSampleLength))
	);
};
