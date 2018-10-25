import Router from 'preact-router';
import Match from 'preact-router/match';

import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars
import cx from 'classnames';
import Transition from 'preact-transition-group';

import Home from '../pages/Home';
import Canvas from './Canvas';

function About() {
  return <h1>About</h1>
}

class TransitionRouter extends Router {
	render(props, state) {
		return (
				<Transition component="section">
					{super.render(props, state)}
				</Transition>
		);
	}
}

class Wrapper extends Component {

	constructor(props) {
		super(props);

		this.state = {
			projectId: -1
		};
	}

	getChildContext() {
		return {
			togglePopup: _ => {},
			projectHover: id => this.setState({projectId: id})
		}
	}

	render() {
		return <div className='app-wrapper'>
			<h1>{this.state.projectId}</h1>
			<Canvas />
			{this.props.children}
		</div>
	}
}

class Menu extends Component {
	render(props) {
		return <ul className="menu" style={{opacity: 0}}>
			<li><a href="/">home</a></li>
			<li className="menu__divider"></li>
			<li><a href="/about">about</a></li>
		</ul>
	}
}

export default class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <Wrapper>
			<Match path="/">
				{({url}) => <Menu url={url} />}
			</Match>
			<TransitionRouter>
				<Home key="wrap-home" path="/" />
				<About key="wrap-about" path="/about" />
			</TransitionRouter>
		</Wrapper>
	}
}
