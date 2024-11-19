export default () => {
	return {
		env: {
			type: 'node',
			runner: 'node',
			params: {
				runner: '--experimental-vm-modules'
			}
		},
		files: [
			'package.json',
			'index.js',
			'src/**/*.js',
			'!src/cli.js'
		],
		tests: [
			'**/*.test.js'
		],
		lowCoverageThreshold: 100,
		workers: { restart: true },
		trace: true,
		name: 'Hippogriff'
	};
};
