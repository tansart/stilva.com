import React, {Component} from 'react';
import cx from "classnames";

export default class ProjectListMiddleItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			phase: 0
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return this.state.phase !== nextState.phase;
	}

	componentDidMount() {
		this.node.addEventListener('transitionend', _ => this.setState({phase: this.state.phase + 1}));
		setTimeout(_ => this.setState({phase:1}));
	}

	render() {
		const props = this.props;
		const span = <span className="project-list__bar"></span>;
		const title = <span className="project-list__title">{props.projectName}</span>;

		const projectListClassname = cx('project-list__wrap', 'middle', {
			'phase--one': this.state.phase > 0,
			'phase--two': this.state.phase > 1,
			'phase--three': this.state.phase > 2
		});

		return <a
				href={`/project/${props.slug}`}
				className={projectListClassname}
				style={{transitionDelay: `${props.index * 250}ms`}}
				ref={el => this.node = el}
				onMouseOver={_ => this.props.projectHover(this.props.index)}
				onMouseOut={_ => this.props.projectHover(-1)}
		>
			{span}
			{title}
			{span}
		</a>;
	}
}
