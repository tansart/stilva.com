import React, {Component} from "react";
import {animated, Spring} from 'react-spring';

import {isProject} from '../utils/menu';

export default class TransitionMask extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const w = window.innerWidth;

		const {location, prevLocation} = this.props;

		if(prevLocation === null || (isProject(prevLocation.pathname) && isProject(location.pathname))) {
			return null;
		}

		return <svg className="transition-mask"
								viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
								style={{
									height: `${window.innerHeight}px`,
									width: `${window.innerWidth}px`,
								}}>
			<Spring
					from={{n: 0, b: 0}}
					to={{n: w, b: w}}
					config={key => key == 'n' ? {tension: 170, friction: 14, clamp: true}: {tension: 170, friction: 20, delay: 1650, clamp: true}}
			>
				{p => <animated.path
						d={`M${p.b} 0 L${p.n} 0 Q${p.n * 1.2} ${window.innerHeight / 2} ${p.n} ${window.innerHeight} L${p.b} ${window.innerHeight} Q${p.b * 1.2} ${window.innerHeight / 2} ${p.b} ${0} Z`}
						fill="rgba(0,0,0,1)"/>
				}
			</Spring>
		</svg>
	}
}
