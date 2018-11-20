import React, {Component} from 'react';
import {Link} from "@reach/router";
import cx from 'classnames';

import {MENU, getIndex} from '../utils/menu';
import {projectList} from '../data';

export default class Menu extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: '',
			mounted: false,
			width: window.innerWidth
		};
	}

	componentDidMount() {
		document.addEventListener('resize', e => {
			this.setState({width: window.innerWidth});
		});

		requestAnimationFrame(_ => {
			this.setState({
				mounted: true
			});
		});
	}

	componentDidUpdate(prevProps) {
		if(prevProps.url !== this.state.prevUrl) {
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

		return <div className="menu__wrapper">
			<ul className="menu" style={{opacity: 1.}}>
				<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 0), MENU[0])}><Link to={MENU[0].url}>home</Link></li>
				{divider}
				<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 1), MENU[1])}><Link to={MENU[1].url}>lab</Link></li>
				{divider}
				<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 2), MENU[2])}><Link to={`${MENU[2].url}/${firstKey}`}>projects</Link></li>
				{divider}
				<li className={getClassName(url, dir, isPrev(prevIndex, newIndex, 3), MENU[3])}><Link to={MENU[3].url}>about</Link></li>
			</ul>

			<svg viewBox="0 0 30 30"
					 xmlns="http://www.w3.org/2000/svg"
					 width="30px"
					 height="30px"
					 shapeRendering="crispEdges"
					 className={mobileClassName}
			>
				<line x1="0" y1="0" x2="30" y2="0" stroke="black" strokeWidth="2" className="menu__line-top"/>
				<line x1="0" y1="0" x2="30" y2="0" stroke="black" strokeWidth="2" className="menu__line-bottom"/>
			</svg>
		</div>
	};
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
