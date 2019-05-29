import React, {useState, useEffect} from 'react';
import {TransitionA} from '../utils/TransitionableRoute';
import {RouterContext} from "../RouterContext";

import Home from '../pages/Home';
import Client from '../pages/Client';
import Lab from '../pages/Lab';

export function ServerSideRouter({path, children}) {
  return <RouterContext.Provider value={{currentRoute: path}}>
    {children}
  </RouterContext.Provider>
}

const isSSR = typeof window === 'undefined';

function Router({children}) {
  const [state, setState] = useState({currentRoute: window.location.pathname, previousRoute: ''});

  const setRoute = path => {
    if(!isSSR) {
      window.history.pushState({}, null, path);
    }

    setState({
      currentRoute: window.location.pathname,
      previousRoute: state.currentRoute
    });
  };

  useEffect(() => {
    function onPopState(e) {
      setState({
        currentRoute: `/${window.location.pathname}`.replace('//', '/'),
        previousRoute: state.currentRoute
      });
    }

    window.addEventListener('popstate', onPopState);

    return function() {
      window.removeEventListener('popstate', onPopState);
    }
  }, []);

  return <RouterContext.Provider value={{setRoute, ...state}}>
    {children}
  </RouterContext.Provider>;
}

export const App = React.memo(function AppFactory() {
  return <TransitionA key="root" path={'/'} debug={true} timeout={850}>
    <Home path='/' />
    <Client path='/client/:clientId' />
    <Lab path='/lab/:labId' />
  </TransitionA>;
});

export default function() {
  return <Router>
    <App />
  </Router>;
}
