import React, {useState, useEffect} from 'react';
import {Router, TransitionableReactRoute} from "@stilva/transitionable-react-router";

import Home from '../pages/home/Home';

import WorkList from '../pages/WorkList';
import WorkEntry from '../pages/WorkEntry';

import LabList from '../pages/LabList';
import LabEntry from '../pages/LabEntry';

export const App = React.memo(function AppFactory() {
  const [timeout, setAnimationTimeout] = useState(850);

  useEffect(() => {
    const eventHandler = () => {
      const animDuration = getComputedStyle(document.documentElement).getPropertyValue('--page-transition-duration');
      const parsed = parseInt(animDuration, 10);
      !Number.isNaN(parsed) && setAnimationTimeout(parseInt(animDuration, 10));
    };

    window.addEventListener('load', eventHandler);
    window.addEventListener('resize', eventHandler);

    eventHandler();

    return () => {
      window.removeEventListener('load', eventHandler);
      window.removeEventListener('resize', eventHandler);
    };
  }, []);

  return <TransitionableReactRoute
    timeout={timeout}
    animateOnMount={true}
  >
    <LabList path="/lab" />
    <LabEntry path="/lab/:labId" />

    <WorkList path="/work" />
    <WorkEntry path="/work/:workId" />

    <Home defaultpath />
  </TransitionableReactRoute>;
});

export default function() {
  return <Router>
    <App />
  </Router>;
}
