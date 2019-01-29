import {useEffect} from 'react';

const keyScrollMap = {};

export default function useOnScroll(transitionState, key) {
	if (transitionState === 'entered' && window.scrollY) {
		keyScrollMap[key] = window.scrollY;
		window.scrollTo(0, 0);
	}

	useEffect(_ => {
		return function () {
			delete keyScrollMap[key];
		}
	}, []);

	return transitionState == 'exiting' && keyScrollMap[key] ? keyScrollMap[key] || 0 : 0;
}
