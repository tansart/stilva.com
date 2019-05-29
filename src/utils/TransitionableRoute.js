import React, {useContext, Component, useEffect, useState, useRef} from 'react';

import {RouterContext} from "../RouterContext";

export function mapToRegExp([pattern, component]) {
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
  }, ['^\\/', []]);

  return [new RegExp(`${regExpPattern}$`, 'ig'), isDynamic, component];
}

function mapToRegExpA([pattern, component]) {
  const mUrl = pattern.split('/');
  const [regExpPattern, isDynamic] = mUrl
    .filter(s => !!s)
    .reduce((acc, curr, i) => {
      const isDynamic = acc[1];
      if(curr.indexOf(':') === 0) {
        isDynamic.push(curr.substring(1));
        return [`${acc[0]}\\/?([^\\/]+)?`, isDynamic];
      }

      isDynamic.push(false);

      if(i > 0) {
        return [`${acc[0]}\\/(${curr})`, isDynamic];
      }
      return [`${acc[0]}(${curr})`, isDynamic];
    }, ['^\\/', []]);

  return [new RegExp(`${regExpPattern}$`, 'ig'), isDynamic, component];
}

export class Link extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {path, children, _ref, ...props} = this.props;

    return <RouterContext.Consumer>
      {({setRoute}) => {
        return <a href={path} onClick={e => {
          e.preventDefault();
          setRoute(path);
        }} {...props} ref={_ref}>{children}</a>
      }}
    </RouterContext.Consumer>
  }
}
const TRANSITION_STATES = ['entering', 'entered', 'exiting', 'exited'];
const TRANTISION_STATES_MAP = TRANSITION_STATES.reduce((acc, k, i) => {
  acc[k] = i;
  return acc;
}, {});

function mutateComponentState(component) {
  if(!component) {
    return null;
  }

  const nextTransitionIndex = TRANTISION_STATES_MAP[component.props.transitionState] + 1;

  if(nextTransitionIndex >= TRANSITION_STATES.length - 1) {
    return null;
  }

  return React.cloneElement(component, {...component.props, transitionState: TRANSITION_STATES[nextTransitionIndex]})
}

export const TransitionA = function _TransitionA({path: _path, timeout = 1000, children}) {
  let mComponent = null;
  let properties = {};

  const routes = useRef([]);
  const timeouts = useRef([]);
  const toRender = useRef([]);
  const [_, setToRender] = useState([]);

  const router = useContext(RouterContext);
  const currentRoute = router.currentRoute.replace(new RegExp(`^${_path}\/?`), '/');

  if(!routes.current.length) {
    React.Children.forEach(children, child => {
      const {path} = child.props;
      routes.current.push(mapToRegExpA([path, child]))
    });
  }

  useEffect(_ => {
    return _ => {
      timeouts.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
    }
  }, []);

  useEffect(() => {
    const latestRenderStack = toRender.current
      .slice(0)
      .map(component => {
        if(component && component.props.transitionState === TRANSITION_STATES[1]) {
          return mutateComponentState(component);
        }

        return component;
      });

    latestRenderStack.push(React.createElement(mComponent.type, {...properties, transitionState: TRANSITION_STATES[0]}))
    toRender.current = latestRenderStack;
    setToRender(`UseEffect ${Date.now()}`);

    const timeoutId = setTimeout(() => {
      toRender.current = toRender.current.map(mutateComponentState);
      timeouts.current = timeouts.current.filter(id => id !== timeoutId);
      setToRender(`UseEffect timeout ${Date.now()}`);
    }, timeout);
    timeouts.current.push(timeoutId);
  }, [currentRoute]);

  for(let [regExp, isDynamic, component] of routes.current) {
    regExp.lastIndex = 0;

    const match = regExp.exec(currentRoute);

    if (!match) {
      continue;
    }

    const key = isDynamic.reduce((acc, _isDynamic, index) => {
      if(_isDynamic) {
        properties[_isDynamic] = match[index + 1];
      }

      const separator = index > 0 ? '/' : '';
      return `${acc}${separator}${match[index + 1] || ''}`;
    }, '') || '/';

    mComponent = component;

    properties['key'] = `${key}_${Date.now()}`;

    break;
  }

  return toRender.current;
};

export default (function TransitionableRouteIIFE() {
})();
