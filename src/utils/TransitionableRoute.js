import React, {useContext, Component} from 'react';
import {Transition, TransitionGroup} from "react-transition-group";

import {RouterContext} from "../RouterContext";

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

export default (function TransitionableRouteIIFE() {

  const routes = [];

  return function TransitionableRoute({children}) {

    let key = null;
    let mComponent = null;
    let subCategory = null;

    const router = useContext(RouterContext);

    if(!routes.length) {
      React.Children.forEach(children, child => {
        const {path} = child.props;
        routes.push(mapToRegExp([path, child]))
      });
    }

    for(let [regExp, isDynamic, component] of routes) {
      regExp.lastIndex = 0;

      const match = regExp.exec(router.currentRoute);

      if (!match) {
        continue;
      }

      key = isDynamic.reduce((acc, _isDynamic, index) => {
        if (!_isDynamic) {
          const separator = index > 0 ? '/' : '';
          return `${acc}${separator}${match[index + 1]}`;
        }

        return `${acc}`;
      }, '') || '/';

      mComponent = component;
      subCategory = typeof match[2] === 'string' ? match[2] : null;

      break;
    }

    return <TransitionGroup component={null} key="transition-group">
      {React.createElement(
        Transition,
        {key, timeout: 475, component: null},
        state => React.createElement(mComponent.type, {subCategory, transitionState: state})
      )}
    </TransitionGroup>
  }
})();
