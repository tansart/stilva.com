import React, {useState, useEffect, useContext, createContext, Component} from 'react';
import TransitionableRoute, {Link} from '../utils/TransitionableRoute';
import Home from '../pages/Home';
import Client from '../pages/Client';
import Lab from '../pages/Lab';

export const RouterContext = createContext();

export function ServerSideRouter({path, children}) {
  return <RouterContext.Provider value={{currentRoute: path}}>
    {children}
  </RouterContext.Provider>
}

class Router extends Component {
  constructor(props) {
    super(props);

    this.isSSR = typeof window === 'undefined';

    this.state = {
      currentRoute: window.location.pathname,
      previousRoute: null,
      goTo: this.goTo.bind(this)
    };
  }

  updateRoute = path => {
    this.setState({
      currentRoute: path,
      previousRoute: this.state.currentRoute
    });
  };

  on(callback) {
    if(this._callback) {
      window.removeEventListener('popstate', this._callback);
    }

    this._callback = callback;
    if(!this.isSSR) {
      window.addEventListener('popstate', callback);
    }
  }

  normalize(_path) {
    return `/${_path}`.replace('//', '/');
  }

  goTo(_path) {
    const path = this.normalize(_path);

    if(!this.isSSR) {
      window.history.pushState({}, null, path);
    }

    this.updateRoute(_path);
  }

  componentDidMount() {
    this.on(e => this.updateRoute(location.pathname));
  }

  render() {
    return <RouterContext.Provider value={this.state}>
      {this.props.children}
    </RouterContext.Provider>
  }
}

export const App = React.memo(function AppFactory() {
  return <TransitionableRoute>
    <Home path='/' />
    <Client path='/client/:clientId' />
    <Lab path='/lab/:labId' />
  </TransitionableRoute>;
});

export default function() {
  return <Router>
    <App />
  </Router>
}
