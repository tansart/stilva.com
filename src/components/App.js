import React, {useState, useEffect} from 'react';
import {Router, TransitionableReactRoute} from "@stilva/transitionable-react-router";

import Home from '../pages/Home';

import ClientList from '../pages/Client/ClientList';
import ClientEntry from '../pages/Client/ClientEntry';

import LabList from '../pages/Lab/LabList';
import LabEntry from '../pages/Lab/LabEntry';

import PPEntry from '../pages/PPEntry';

export const App = React.memo(function AppFactory() {
  const [timeout, setAnimationTimeout] = useState(850);

  useEffect(() => {
    const eventHandler = () => {
      const animDuration = getComputedStyle(document.documentElement).getPropertyValue('--page-transition-duration');
      setAnimationTimeout(parseInt(animDuration, 10));
    };

    window.addEventListener('load', eventHandler);
    window.addEventListener('resize', eventHandler);

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

    <ClientList path="/client" />
    <ClientEntry path="/client/:clientId" />

    <PPEntry path="/paperlesspost" />

    <Home defaultpath />
  </TransitionableReactRoute>;
});

export default function() {
  return <Router>
    <App />
  </Router>;
}
