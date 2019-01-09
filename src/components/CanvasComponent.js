import React, {Component} from 'react';

export default class CanvasComponent extends Component {
	componentDidMount() {
		this.props.componentDidMount(this.el);
	}

	shouldComponentUpdate() {
		return false;
	}

	render() {
		return <canvas
				ref={node => this.el = node} 
				width={400}
				height={400}
		/>;
	}
}
