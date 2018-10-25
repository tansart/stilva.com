import {h, Component} from "preact";  // eslint-disable-line no-unused-vars
import cx from "classnames";

export default class ProjectListMiddleItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			phase: 0
		};
	}

	componentDidMount() {
		this.node.addEventListener('transitionend', _ => this.setState({phase: this.state.phase + 1}));
		setTimeout(_ => this.setState({phase:1}));
	}

	render(props) {
		const span = <span className="project-list__bar"></span>;
		const title = <span className="project-list__title">QWERTY</span>;

		const projectListClassname = cx('project-list__wrap', 'middle', {
			'phase--one': this.state.phase > 0,
			'phase--two': this.state.phase > 1,
			'phase--three': this.state.phase > 2
		});

		return <a
				className={projectListClassname}
				style={{transitionDelay: `${props.index * 250}ms`}}
				ref={el => this.node = el}
				onMouseOver={_ => this.context.projectHover(this.props.index)}
				onMouseOut={_ => this.context.projectHover(-1)}
		>
			{span}
			{title}
			{span}
		</a>;
	}
}
