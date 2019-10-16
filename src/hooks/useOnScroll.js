import {useEffect, useRef} from 'react';

export default function useOnScroll(transitionstate) {
  const offset = useRef(0);
  const prevTransition = useRef(transitionstate);

  useEffect(() => {
    const body = document.querySelector('html, body');
    const cb = () => (offset.current = body.scrollTop);

    document.addEventListener('scroll', cb);
    return () => {
      document.removeEventListener('scroll', cb);
    };
  }, []);

  if(prevTransition.current !== transitionstate) {
    prevTransition.current = transitionstate;
    if(transitionstate === 'exiting') {
      window.scrollTo(0, 0);
    }
  }

  return offset.current;
}
