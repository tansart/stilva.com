import {useEffect, useLayoutEffect, useRef} from 'react';

export default function useOnScroll(transitionstate, section) {
  const offset = useRef(0);
  const prevTransition = useRef(transitionstate);

  useLayoutEffect(() => {
    const body = document.body;
    const cb = () => (offset.current = body.scrollTop);
    body.addEventListener('scroll', cb);
    return () => {
      body.removeEventListener('scroll', cb);
    };
  }, []);

  useLayoutEffect(() => {
    if (prevTransition.current !== transitionstate) {
      prevTransition.current = transitionstate;
      if (transitionstate === 'exiting') {
        document.body.scrollTo(0, 0);
      }
    }
  }, [transitionstate]);

  if (transitionstate === 'exiting') {
    return offset.current;
  }

  return 0;//offset.current;
}
