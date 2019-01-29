import {useEffect} from 'react';

const keyScrollMap = {};
const _global = typeof window !== 'undefined' ? window: {scrollY:0};

export default function useOnScroll(transitionState, key) {
	if (transitionState === 'entered' && _global.scrollY) {
		keyScrollMap[key] = _global.scrollY;
		_global.scrollTo(0, 0);
	}

	useEffect(_ => {
		return function () {
			delete keyScrollMap[key];
		}
	}, []);

	return transitionState == 'exiting' && keyScrollMap[key] ? keyScrollMap[key] || 0 : 0;
}
