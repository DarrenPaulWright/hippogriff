import type { IInternalSettings } from '../../hippogriff.models.js';

const isSkipped = (settings: Readonly<IInternalSettings>): boolean => {
	return settings.skip ||
		(settings.parent !== undefined && isSkipped(settings.parent.settings));
};

const isOnly = (settings: Readonly<IInternalSettings>): boolean => {
	return settings.only ||
		(settings.parent !== undefined && isOnly(settings.parent.settings));
};

const canRun = (hasOnly: boolean, settings: Readonly<IInternalSettings>): boolean => {
	return !isSkipped(settings) && (!hasOnly || isOnly(settings));
};

export default canRun;
