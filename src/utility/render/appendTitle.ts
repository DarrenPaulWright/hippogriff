import { GROUP_ICON } from '../../constants.js';

const appendTitle = (fullTitle: string, newTitle: string): string => {
	return fullTitle === '' ?
		newTitle :
		`${ fullTitle }${ GROUP_ICON }${ newTitle }`;
};

export default appendTitle;
