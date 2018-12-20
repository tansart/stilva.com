import React, {Component} from "react";
import {Link} from '@reach/router';
import cx from 'classnames';

export default class AnimatedLink extends Component {

	constructor(props) {
		super(props);

		this.state = {
			visible: false
		}
	}

	componentDidMount() {
		this.observer = new IntersectionObserver(([entry]) => {
			const {intersectionRatio} = entry;

			this.setState({visible: intersectionRatio >= 1})
		}, {
			threshold: [0., 1.0]
		});

		this.observer.observe(this.node)
	}

	componentWillUnmount() {
		this.observer.unobserve(this.node);
	}

	render() {
		const {link, label, ...extra} = this.props;
		const external = !link || link.indexOf('http') > -1;

		const className = cx('animated-link', {visible: this.state.visible});

		const props = {className, label};

		if (external) {
			return <a href={link} {...extra} ref={node => this.node = node}>
				<AnimatedLinkDecorator {...props} />
			</a>
		}

		return <Link to={link} ref={node => this.node = node}>
			<AnimatedLinkDecorator {...props} />
		</Link>
	}
}

function AnimatedLinkDecorator({className, label}) {
	return <span className={className}>
		<span className={'animated-link__text'}>{label}</span>
		<span className={'animated-link__underline'}/>
	</span>
}
