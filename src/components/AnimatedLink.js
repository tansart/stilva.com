import React, {Component, useRef} from "react";
import cx from 'classnames';

import {Link} from '../utils/TransitionableRoute';
import {RouterContext} from "../RouterContext";

export default class AnimatedLink extends Component {

  static contextType = RouterContext;

  constructor(props) {
    super(props);

    this.state = {
      visible: typeof IntersectionObserver !== 'undefined' ? false : true
    }
  }

  componentDidMount() {
    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    this.observer = new IntersectionObserver(([entry]) => {
      const {intersectionRatio} = entry;

      this.setState({visible: intersectionRatio >= 1})
    }, {
      threshold: [0., 1.0]
    });

    this.observer.observe(this.node)
  }

  componentWillUnmount() {
    this.observer && this.observer.unobserve(this.node);
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

    const onClick = e => {
      e.preventDefault();
      this.context.setRoute(link);
    };

    return <a href={link} ref={node => this.node = node} onClick={onClick}>
        <AnimatedLinkDecorator {...props} />
    </a>
  }
}

function AnimatedLinkDecorator({className, label}) {
  return <span className={className}>
		<span className={'animated-link__text'}>{label}</span>
		<span className={'animated-link__underline'}/>
	</span>
}
