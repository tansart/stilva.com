import React, {Component, Fragment} from 'react';
import {Link} from "@reach/router";
import cx from 'classnames';
import {animated, Spring, Transition} from 'react-spring';

import {MENU, getIndex} from '../utils/menu';
import {projectList} from '../data';

export default class Menu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: '',
			mounted: false,
			mobileMenuOpened: false,
			width: window.innerWidth
		};

		this.menuBackground = type => p => this._menuBackground(p, type);
	}

	_menuBackground(p, type) {
		const w = window.innerWidth;
		const firstKey = projectList.keys().next().value;

		return <Fragment>
			<svg className="menu__mobile-background"
					 viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
					 style={{
						 height: `${window.innerHeight}px`,
						 width: `${window.innerWidth}px`,
					 }}>
				<animated.path
						key="animated-path"
						d={`M${w} 0 L${p.n} 0 Q${p.n * p.d} ${window.innerHeight / 2} ${p.n} ${window.innerHeight} L${w} ${window.innerHeight} Z`}
						fill="rgba(0,0,0,1)"/>
			</svg>

			<svg className="menu__mobile-close"
					 viewBox="0 0 30 30"
					 height="30px"
					 width="30px"
					 onClick={_ => this.setState({mobileMenuOpened: false})}>
				<line x1="0" y1="15" x2="30" y2="15" stroke="white" strokeWidth="2" />
			</svg>

			<ul className="menu--mobile" style={{opacity: 1.}}>
				<li className={''}>
					<Link to={MENU[0].url} style={{transform: `translateX(${100 - clampAboveZero(p.t, type == 'leave')}%)`}}>home</Link>
				</li>
				<li className={''}>
					<Link to={MENU[1].url} style={{transform: `translateX(${100 - clampAboveZero(p.t, type == 'enter')}%)`}}>lab</Link>
				</li>
				<li className={''}>
					<Link to={`${MENU[2].url}/${firstKey}`} style={{transform: `translateX(${100 - clampAboveZero(p.t, type == 'enter')}%)`}}>projects</Link>
				</li>
				<li className={''}>
					<Link to={MENU[3].url} style={{transform: `translateX(${100 - clampAboveZero(p.t, type == 'leave')}%)`}}>about</Link>
				</li>
			</ul>
		</Fragment>;
	}

	componentDidMount() {
		window.addEventListener('resize', e => {
			this.setState({
				width: window.innerWidth,
				mobileMenuOpened: window.innerWidth > 768 ? false : this.state.mobileMenuOpened
			});
		});

		requestAnimationFrame(_ => {
			this.setState({
				mounted: true
			});
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.url !== this.state.prevUrl) {
			this.setState({prevUrl: prevProps.url});
		}
	}

	render() {
		const {url} = this.props;
		const {prevUrl, mounted} = this.state;

		const mobileClassName = cx('menu__mobile', {
			animate: mounted
		});

		const firstKey = projectList.keys().next().value;

		const divider = <li className="menu__divider"></li>;

		const newIndex = getIndex(url);
		const prevIndex = getIndex(prevUrl);
		const dir = newIndex < prevIndex;

		if (this.state.width > 768) {
			return <div className="menu__wrapper">
				<ul className="menu" style={{opacity: 1.}}>
					<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 0), MENU[0])}>
						<Link to={MENU[0].url}>home</Link>
					</li>
					{divider}
					<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 1), MENU[1])}>
						<Link to={MENU[1].url}>lab</Link>
					</li>
					{divider}
					<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 2), MENU[2])}>
						<Link to={`${MENU[2].url}/${firstKey}`}>projects</Link>
					</li>
					{divider}
					<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 3), MENU[3])}>
						<Link to={MENU[3].url}>about</Link>
					</li>
				</ul>
			</div>
		}

		const w = window.innerWidth;

		return <div className="menu__wrapper">
			<svg viewBox="0 0 30 30"
					 xmlns="http://www.w3.org/2000/svg"
					 width="30px"
					 height="30px"
					 shapeRendering="crispEdges"
					 className={mobileClassName}
					 onClick={_ => this.setState({mobileMenuOpened: true})}
					 style={this.state.mobileMenuOpened ? {pointerEvents: 'none'} : null}
			>
				<line x1="0" y1="0" x2="30" y2="0" stroke="black" strokeWidth="2" className="menu__line-top"/>
				<line x1="0" y1="0" x2="30" y2="0" stroke="black" strokeWidth="2" className="menu__line-bottom"/>
			</svg>

			<Transition
					items={this.state.mobileMenuOpened}
					from={{n: w, d: .7, t: 0}}
					enter={{n: 0, d: .85, t: 100}}
					leave={{n: w, d: 1.25, t: 0}}
					config={(_,type) => (
							key => key == 't' ? {tension: type == 'enter' ? 170: 135, friction: type == 'enter' ? 14: 18, clamp: true, delay: type == 'enter' ? 250: 0} : {
								tension: 170,
								friction: 14,
								clamp: true,
								delay: type == 'enter' ? 0: 200
							}
					)}>
				{(show, type) =>
						show && this.menuBackground(type)
				}
			</Transition>
		</div>
	};
}

function clampAboveZero(_v, applyOffset) {
	const v = _v * (applyOffset ? 1.25: 1);
	return (v > 100 ? 100: v);
}

function isPrev(prevIndex, newIndex, targetIndex) {
	return newIndex !== prevIndex && prevIndex == targetIndex;
}

function getClassName(url, dir, wasPrev, {pattern}) {
	return cx('menu__item', {
		active: !!pattern.exec(url),
		'animate-out': wasPrev,
		reverse: dir
	});
}
