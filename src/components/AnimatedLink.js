import React, {Component, useRef} from 'react';
import {css, cx} from 'linaria';

import {RouterContext} from "@stilva/transitionable-react-router";

const anchor = css`
  cursor: pointer;
`;

const animatedLink = css`
  color: white;
  display: inline-block;
  overflow: hidden;
  position: relative;
  vertical-align: bottom;

  .text {
    display: block;
    position: relative;
    transition: color 250ms ease-out;
    z-index: 1;

    &:after {
      background: white;
      content: "";
      height: 100%;
      left: 0;
      position: absolute;
      transform: translateX(calc(-100% - 1px));
      transition: transform 250ms ease-out;
      top: 0;
      width: 100%;
      z-index: -1;
    }
  }

  .underline {
    background: white;
    bottom: 0;
    display: block;
    height: 1px;
    left: 0;
    position: absolute;
    transform: translateX(calc(-100% - 1px));
    transition: transform 250ms ease-out;
    width: 100%;

    //@media #{$tablet-large} {
    //  height: 2px;
    //}
  }
  
  &.visible .underline {
    transform: translateX(0);
  }

  &:hover {
    .text {
      color: black;

      &:after {
        transform: translateX(0);
      }
    }
  }
`;

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

    const className = cx(animatedLink, this.state.visible && 'visible');

    const props = {className, label};

    if (external) {
      return <a
        className={anchor}
        href={link}
        {...extra}
        ref={node => this.node = node}>
        <AnimatedLinkDecorator {...props} />
      </a>
    }

    const onClick = e => {
      e.preventDefault();
      this.context.setRoute(link);
    };

    return <a
      className={anchor}
      href={link}
      onClick={onClick}
      ref={node => this.node = node}
    >
        <AnimatedLinkDecorator {...props} />
    </a>
  }
}

function AnimatedLinkDecorator({className, label}) {
  return <span className={className}>
		<span className={'text'}>{label}</span>
		<span className={'underline'}/>
	</span>
}
