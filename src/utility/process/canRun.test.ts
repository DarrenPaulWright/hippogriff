import { clone } from 'object-agent';
import { assert } from 'type-enforcer';
import { describe, it } from '../../../index.js';
import { testDescribe } from '../../../sampleTests/testData.helper.js';
import type { IDescribe, IInternalSettings } from '../../hippogriff.models.js';
import canRun from './canRun.js';

const settings: IInternalSettings = { ...testDescribe.settings };

[true, false].forEach((hasOnly) => {
	describe(`hasOnly ${ hasOnly }`, () => {
		[true, false].forEach((skip) => {
			describe(`skip ${ skip }`, () => {
				[true, false].forEach((only) => {
					if (skip && only) {
						return;
					}

					describe(`only ${ only }`, () => {
						const expected = !skip && (!hasOnly || only);

						it(`should return ${ expected } if skip is ${ skip }`, () => {
							const result = canRun(hasOnly, {
								...settings,
								skip,
								only
							});

							assert.is(result, expected);
						});

						it(`should return ${ expected } if parent skip is ${ skip }`, () => {
							const result = canRun(hasOnly, {
								...settings,
								parent: {
									...clone(testDescribe) as IDescribe,
									settings: {
										...settings,
										skip,
										only
									}
								}
							});

							assert.is(result, expected);
						});

						it(`should return ${ expected } if deep ancestor skip is ${ skip }`, () => {
							const result = canRun(hasOnly, {
								...settings,
								parent: {
									...clone(testDescribe) as IDescribe,
									settings: {
										...settings,
										parent: {
											...clone(testDescribe) as IDescribe,
											settings: {
												...settings,
												parent: {
													...clone(testDescribe) as IDescribe,
													settings: {
														...settings,
														skip,
														only
													}
												}
											}
										}
									}
								}
							});

							assert.is(result, expected);
						});
					});
				});
			});
		});
	});
});
