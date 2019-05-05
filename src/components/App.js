import React, {useState, useEffect, useContext, createContext, Component} from 'react';
import {Transition, TransitionGroup} from "react-transition-group";

const RouterContext = createContext();

export function ServerSideRouter({route, children}) {
  const router = new Router(route);
  return <RouterContext.Provider value={router}>
    {children}
  </RouterContext.Provider>
}

function Home({subCategory}) {
  useEffect(() => {
    console.log("Home has mounted")
  }, []);
  return <h1>Home/{subCategory}</h1>
}

function Client({subCategory}) {
  useEffect(() => {
    console.log("Client has mounted")
  }, []);
  return <h1>Client/{subCategory}</h1>
}

function Lab({subCategory}) {
  useEffect(() => {
    console.log("Lab has mounted")
  }, []);
  return <h1>Lab/{subCategory}</h1>
}

const routes = [
  ['/', Home],
  ['/client/:clientId', Client],
  ['/lab/hello', Lab],
  ['/lab/bye', Lab]
].map(mapToRegExp);

function mapToRegExp([pattern, component]) {
  const mUrl = pattern.split('/');
  const [regExpPattern, isDynamic] = mUrl.filter(s => !!s).reduce((acc, curr, i) => {
    const isDynamic = acc[1];
    if(curr.indexOf(':') === 0) {
      isDynamic.push(true);
      return [`${acc[0]}\\/?([^\\/]+)?`, isDynamic];
    }

    isDynamic.push(false);

    if(i > 0) {
      return [`${acc[0]}\\/(${curr})`, isDynamic];
    }
    return [`${acc[0]}(${curr})`, isDynamic];
  }, ['\\/', []]);

  return [new RegExp(`${regExpPattern}$`, 'ig'), isDynamic, component];
}

/**
 * What do we want?
 *
 * ~1. Transitions between main routes?~
 * 2. Link kind of component? (so we need context)
 * ~3. Let sub components handle their own transitions?~
 * ~4. server side rendering~
 */

class Router {
  constructor(route) {
    this.isSSR = typeof window === 'undefined';
    this.currentRoute = !this.isSSR ? window.location.pathname: route;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  on(callback) {
    if(!this.isSSR) {
      window.addEventListener('popstate', callback);
    }
  }

  goTo(path) {
    this.currentRoute = path;
    if(!this.isSSR) {
      window.history.pushState({}, null, path);
    }
  }

  useRouter() {
    const [url, setUrl] = useState(this.currentRoute);

    useEffect(() => {
      this.on(function() {
        setUrl(window.location.pathname);
      });
    },[]);

    const setHistoryUrl = (path) => {
      setUrl(path);
      this.goTo(path);
    };

    return [url, setHistoryUrl];
  }
}

export const App = React.memo(function AppFactory() {
  const router = useContext(RouterContext);
  const [url, setUrl] = router.useRouter();

  useEffect(function() {
    setTimeout(_ => {
      setUrl('/');
    }, 1000);

    setTimeout(_ => {
      setUrl('/lab/hello');
    }, 2000);

    setTimeout(_ => {
      setUrl('/lab/bye');
    }, 3000);

    setTimeout(_ => {
      setUrl('/client/name-of-client');
    }, 4000);

    setTimeout(_ => {
      setUrl('/client/name-of-client-2');
    }, 5000);
  }, []);

  const [key, mComponent] = routes.map(([regExp, isDynamic, component]) => {
    regExp.lastIndex = 0;
    const match = regExp.exec(url);
    if(!match) return null;

    const key = isDynamic.reduce((acc, _isDynamic, index) => {
      if(!_isDynamic) {
        const separator = index > 0 ? '/': '';
        return `${acc}${separator}${match[index + 1]}`;
      }

      return `${acc}`;
    }, '') || '/';

    const subCategory = typeof match[2] === 'string' ? match[2]: null;

    return [
      key,
      React.createElement(component, {subCategory})
    ];
  }).filter(c => !!c)[0];

  return <TransitionGroup component={null} key="transition-group">
    {React.createElement(
      Transition,
      {key, timeout: 475, component: null},
      mComponent
    )}
  </TransitionGroup>
});

export default function AppWrapper() {
  const router = new Router();
  return <RouterContext.Provider value={router}>
    <App />
  </RouterContext.Provider>
}
