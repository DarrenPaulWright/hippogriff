import sum from './sum.js';

const mean = (samples: Array<number>): number => {
	return (samples.length === 0) ?
		0 :
		(sum(samples) / samples.length);
};

export default mean;
