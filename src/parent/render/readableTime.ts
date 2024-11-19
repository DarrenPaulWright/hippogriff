const round = (value: number, fractionDigits = 0): number => {
	const digits = Math.pow(10, Math.max(0, fractionDigits));

	return Math.round(value * digits) / digits;
};

const MULTIPLIER = 1000000;
const conversion = Object.entries({
	h: 60 * 60 * 1000 * MULTIPLIER,
	m: 60 * 1000 * MULTIPLIER,
	s: 1000 * MULTIPLIER,
	ms: MULTIPLIER,
	μs: 1000
});

const readableTime = (duration: number): string => {
	let suffix = 'ns';
	let outTime = duration * MULTIPLIER;

	conversion.some(([valueSuffix, value]) => {
		if (outTime >= value) {
			suffix = valueSuffix;
			outTime /= value;

			return true;
		}

		return false;
	});

	outTime = round(
		outTime,
		2 - Math.max(Math.floor(Math.log10(outTime)), 0)
	);

	return `${ outTime.toLocaleString() }${ suffix }`;
};

export default readableTime;
