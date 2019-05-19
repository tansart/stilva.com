import React, {Component, useRef} from "react";
import cx from 'classnames';

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
    const className = cx('category-link', {visible: this.state.visible});
    const props = {className, label};
    const onClick = e => {
      e.preventDefault();
      this.context.setRoute(link)
    };

    return <a href={link} onClick={onClick} {...extra} ref={node => this.node = node} className="category-link__wrapper">
      <CategoryLinkDecorator {...props} />
    </a>;
  }
}

function CategoryLinkDecorator({className, label}) {
  return <span className={className}>
		<span className={'category-link__text'}>{label}</span>
		<span className={'category-link__underline'}/>
	</span>
}
