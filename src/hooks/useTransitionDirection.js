import {useRef, useContext, useEffect} from 'react';
import {RouterContext} from "@stilva/transitionable-react-router";

const RL = 'page--rl';
const LR = 'page--lr';

export default function useTransitionDirection(type, transitionstate) {
  const prevTransition = useRef('');
  const {currentRoute, previousRoute} = useContext(RouterContext);

  let dirty = prevTransition.current !== transitionstate;

  // first load
  if(previousRoute === '') {
    return '';
  }

  if(dirty) {
    prevTransition.current = transitionstate;
  } else {
    return '';
  }

  const dirCurr = getSlug(currentRoute);
  const dirPrev = getSlug(previousRoute);

  // this needs fixing...
  if(transitionstate === 'entering') {
    if(dirCurr === 'home') {
      return LR;
    }
    if(dirCurr === 'client-list' || dirCurr === 'lab-list') {
      if(dirPrev === 'client-entry' || dirPrev === 'lab-entry') {
        return LR;
      }
      if(dirPrev === 'home') {
        return RL;
      }
    }
    if(dirCurr === 'client-entry' || dirCurr === 'lab-entry') {
      return RL;
    }
  } else if(transitionstate === 'exiting') {
    if(dirCurr === 'home') {
      return LR;
    }
    if(dirCurr === 'client-list' || dirCurr === 'lab-list') {
      if(dirPrev === 'client-entry' || dirPrev === 'lab-entry') {
        return LR;
      }
      if(dirPrev === 'home') {
        return RL;
      }
    }
    if(dirCurr === 'client-entry' || dirCurr === 'lab-entry') {
      return RL;
    }
  }

  return '';
}

function getSlug(route) {
  const pattern = /^\/(client|lab)\/?(.*)?$/i;
  const match = pattern.exec(route);

  if(!match) {
    return 'home';
  }

  return !!match[2] ? `${match[1]}-entry`: `${match[1]}-list`;
}
