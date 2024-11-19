import chalk from 'chalk';

const colorize: { [key: string]: (value: string) => string } = {
	blank: chalk.bgBlack,
	logs: chalk.white,
	passGroup: chalk.greenBright,
	pass: chalk.greenBright,
	failGroup: chalk.redBright,
	fail: chalk.redBright,
	skip: chalk.gray,
	tree: chalk.gray,
	stats: chalk.yellow,
	count: chalk.cyan,
	group: chalk.cyan,
	error: chalk.yellow,
	removedRow: chalk.bgBlack.red,
	removed: chalk.bgRed.white,
	addedRow: chalk.bgBlack.green.dim,
	added: chalk.bgGreen.white,
	subText: chalk.gray.dim,
	raw: chalk.white
};

export default colorize;
