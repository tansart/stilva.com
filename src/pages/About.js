import React, {Component} from "react";

const style = {
	display: 'block',
	position: 'absolute',
	height: '100vh',
	top: 0,
	left: 0,
	width: '100vw'
};

export default class About extends Component {

	constructor(props) {
		super(props);

		this.state = {
			show: false
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.props.state !== nextProps.state
				|| this.state.show !== nextProps.show;
	}

	componentDidMount() {
		setTimeout(_ => {
			this.setState({show: true})
		}, 250);
	}

	render() {
		const props = this.props;

		const colors = {
			project: 'red',
			lab: 'yellow',
			about: 'green'
		};

		return <div style={Object.assign({}, style, {
			background: colors[props.type],
			transform: `translateX(${this.state.show ? 0 : -100}%)`,
			zIndex: props.state == 'entering' ? 1 : 0
		})}>
			<h1 style={{color: 'white', paddingTop: '100px', zIndex: 1, display: 'block', position: 'relative'}}>
				{Date.now()} {props.type} {props.state}
			</h1>
			{props.type}
		</div>
	}
}
