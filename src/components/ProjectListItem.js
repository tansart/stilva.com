import {h, Component} from "preact";  // eslint-disable-line no-unused-vars
import cx from "classnames";

export default class ProjectListItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			reveal: false
		};
	}

	componentDidMount() {
		this.node.addEventListener('transitionend', _ => {
			this.setState({reveal: true});
		})
	}

	render(props) {
		const moduloIndex = (props.index + 2)%3;
		const span = <span className="project-list__bar"></span>;
		const title = <span className="project-list__title">{props.projectName}</span>;

		const projectListClassname = cx('project-list__wrap', {
			'right': moduloIndex === 2,
			'left': moduloIndex === 1,
			'reveal': this.state.reveal
		});

		return <a
				href={`/projects/${props.slug}`}
				className={projectListClassname}
				style={{transitionDelay: `${props.index * 250}ms`}}
				ref={el => this.node = el}
				onMouseOver={_ => this.props.projectHover(this.props.index)}
				onMouseOut={_ => this.props.projectHover(-1)}
		>
			{moduloIndex === 2 ? span: null}
			{title}
			{moduloIndex === 1 ? span: null}
		</a>;
	}
}
