export const MENU = [
	{pattern: /^\/$/i, url: '/'},
	{pattern: /^\/lab(\/.+)?/i, url: '/lab'},
	{pattern: /^\/project(\/.+)?/i, url: '/project'},
	{pattern: /^\/about/i, url: '/about'},
];

export function isProject(url) {
	return !!MENU[2].pattern.exec(url);
}

export function getIndex(url) {
	for (let i = 0; i < MENU.length; i++)
		if (!!MENU[i].pattern.exec(url)) {
			return i;
		}

	return -1;
}

export function getPrevNext(projectList, projectId) {
	const keys = Array.from(projectList.keys());
	const entries = Array.from(projectList.entries());
	const index = keys.indexOf(projectId);

	const prevIndex = index - 1 < 0 ? keys.length - 1 : index - 1;
	const nextIndex = (index + 1) % keys.length;

	return [entries[prevIndex], entries[index], entries[nextIndex]];
}
