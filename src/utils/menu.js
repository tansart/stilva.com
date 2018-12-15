export const MENU = [
	{pattern: /^\/$/i, url: '/'},
	{pattern: /^\/client(\/.+)?/i, url: '/client'},
];

export function isClient(url) {
	return !!MENU[1].pattern.exec(url);
}

export function getIndex(url) {
	for (let i = 0; i < MENU.length; i++)
		if (!!MENU[i].pattern.exec(url)) {
			return i;
		}

	return -1;
}
