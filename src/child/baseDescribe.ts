import { basename } from 'node:path';
import type { IDescribe } from '../hippogriff.models';

const fileName = basename(process.argv[1]);

const baseDescribe: IDescribe = {
	title: fileName,
	lifeCycle: {
		before: [],
		beforeEach: [],
		work: [],
		afterEach: [],
		after: []
	},
	settings: {
		testTimeout: 2000,
		benchMaxDuration: 200,
		benchMaxSamples: 100,
		benchDistinctCharts: false,
		benchDuration: false,
		benchColors: 'light',
		skip: false,
		only: false,
		index: 0
	}
};

export default baseDescribe;
