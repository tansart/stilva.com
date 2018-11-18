import React, {Component} from "react";
import {animated, Spring} from 'react-spring';

export default class SVGMask extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;

		return <Spring
				from={{aa: 5}}
				to={{aa: window.innerWidth}}>
			{p => <animated.svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
								 style={{
									 top: 0,
									 position: 'absolute',
									 height: `${window.innerHeight}px`,
									 width: `${window.innerWidth}px`,
									 pointerEvents: 'none',
									 zIndex: 2
								 }}>
				<clipPath id={`my${props.type}`}>
					<animated.path
							d={`M0 0 L${p.aa} 0 Q${p.aa * 1.2} ${window.innerHeight / 2} ${p.aa} ${window.innerHeight} L0 ${window.innerHeight} Z`}
							stroke="black" fill="purple" />
				</clipPath>
			</animated.svg>}
		</Spring>
	}
}
