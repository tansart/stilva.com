import React, {Component} from "react";
import {animated, Spring} from 'react-spring';

export default class SVGMask extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const props = this.props;
		const w = window.innerWidth;
		return <Spring
				from={{w: 0, t: -window.innerWidth}}
				to={{w: 200, t: 0}}>
			{p => <svg viewBox={`0 0 ${w} ${window.innerHeight}`}
								 style={{
									 top: 0,
									 position: 'absolute',
									 height: `${window.innerHeight}px`,
									 width: `${w}px`,
									 pointerEvents: 'none',
									 zIndex: 2
								 }}>
				<animated.path
						d={`M0 0 L${w - 200 + p.w} 0 Q${(w - 200 + p.w) * 1.2} ${window.innerHeight / 2} ${w - 200 + p.w} ${window.innerHeight} L${0} ${window.innerHeight} Z`}
						fill="transparent" stroke="black"/>
			</svg>}
		</Spring>
	}
}
