import { emitKeypressEvents } from 'node:readline';

const watchKeyPress = (onRunAll: () => void): void => {
	emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);

	process.stdin.on('keypress', (_key, data) => {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if ((data.ctrl && data.name === 'c') || data.name === 'escape') {
			process.exit(0);
		}
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		else if (data.name === 'space') {
			onRunAll();
		}
	});
};

export default watchKeyPress;
