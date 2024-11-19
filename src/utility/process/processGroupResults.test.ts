import { clone } from 'object-agent';
import { assert } from 'type-enforcer';
import {
	testDescribe,
	testGroupResult,
	testTestResult
} from '../../../sampleTests/testData.helper.js';
import { it } from '../../hippogriff.js';
import type { IDescribe, ITestResult } from '../../hippogriff.models.js';
import processGroupResults from './processGroupResults.js';

it('should handle empty results', () => {
	const result = processGroupResults(
		clone(testDescribe) as IDescribe,
		[],
		false,
		[]
	);

	assert.equal(result, testGroupResult());
});

it('should handle empty results skipped', () => {
	const result = processGroupResults(
		clone(testDescribe) as IDescribe,
		[],
		true,
		[]
	);

	assert.equal(result, {
		...testGroupResult(),
		isSkipped: true
	});
});

it('should handle groups', () => {
	const results = [{
		...testGroupResult(),
		isSkipped: true,
		summary: {
			...testGroupResult().summary,
			skipCount: 1
		}
	}, {
		...testGroupResult(),
		summary: {
			...testGroupResult().summary,
			passingDurations: [1],
			errorsDurations: []
		}
	}, {
		...testGroupResult(),
		summary: {
			...testGroupResult().summary,
			passingDurations: [1.2],
			errorsDurations: []
		}
	}, {
		...testGroupResult(),
		summary: {
			...testGroupResult().summary,
			passingDurations: [0, 0],
			errorsDurations: [1, 2]
		}
	}];

	const result = processGroupResults(
		clone(testDescribe) as IDescribe,
		results,
		false,
		[]
	);

	assert.equal(result, {
		...testGroupResult(),
		results,
		isSkipped: false,
		summary: {
			passCount: 4,
			failCount: 0,
			skipCount: 1,
			passingDurations: [1, 1.2, 0, 0],
			errorsDurations: [1, 2]
		}
	});
});

it('should handle tests', () => {
	const error1 = new Error('test error 1');
	const error2 = new Error('test error 2');
	const results: Array<ITestResult> = [{
		...testTestResult(),
		error: false,
		duration: 1
	}, {
		...testTestResult(),
		isSkipped: true
	}, {
		...testTestResult(),
		isSkipped: true
	}, {
		...testTestResult(),
		error: error1,
		duration: 2
	}, {
		...testTestResult(),
		error: error2,
		duration: 0
	}];

	const result = processGroupResults(
		clone(testDescribe) as IDescribe,
		results,
		false,
		[]
	);

	assert.equal(result, {
		...testGroupResult(),
		results,
		isSkipped: false,
		summary: {
			passCount: 1,
			failCount: 2,
			skipCount: 2,
			passingDurations: [1],
			errorsDurations: [2, 0]
		}
	});
});
