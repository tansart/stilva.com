import React, {Component} from "react";
import cx from 'classnames';

import {RouterContext} from "@stilva/transitionable-react-router";
import lab from "../lab";

class Animator {
  constructor(time = 0, render) {
    this._progress = 0;
    this._direction = 0; // -1: hide, 0 : idle, 1: show
    this._targetTime = 0;
    this._time = time;
    this._reference = null;
    this._render = render;
  }

  onEnter = () => {
    // clearTimeout(this._reference);
    cancelAnimationFrame(this._reference);
    this._direction = 1;
    this._targetTime = Date.now() + (1 - this._progress) * this._time;
    requestAnimationFrame(this._tick)
  };

  onLeave = () => {
    // clearTimeout(this._reference);
    cancelAnimationFrame(this._reference);
    this._direction = -1;
    this._targetTime = Date.now() + this._progress * this._time;
    requestAnimationFrame(this._tick)
  };

  _tick = () => {
    if(this._direction === 0) {
      return;
    }

    const now = Date.now();
    if(this._direction > 0) {
      this._progress = 1 - (this._targetTime - now)/this._time;
    } else {
      this._progress = (this._targetTime - now)/this._time;
    }

    if(this._progress >= 1 && this._direction == 1) {
      this._direction = 0;
      this._progress = 1;
    } else if(this._progress <= 0 && this._direction == -1) {
      this._direction = 0;
      this._progress = 0;
    }

    this._render(this._progress);

    // this._reference = setTimeout(this._tick, 250);
    this._reference = requestAnimationFrame(this._tick);
  };
}

export default class AnimatedLink extends Component {

  static contextType = RouterContext;

  constructor(props) {
    super(props);

    this._animator = new Animator(250, this.update);

    this.__rafRef = null;
    this.__currentIndex = 0;
    this.__isHovering = false;
  }

  update = (t) => {
    for(let r of this.ratios) {
      if(t > r.max) {
        r.t.style.transform = `translateX(0%)`;
      } else if(t <= r.min) {
        r.t.style.transform = `translateX(105%)`;
      } else if(r.min < t && t <= r.max) {
        const transform = (t - r.min)/r.time * 100 - 100;
        r.t.style.transform = `translateX(${Math.min(transform, 0)}%)`;
      }
    }
  };

  componentDidMount() {
    if (typeof IntersectionObserver === 'undefined') {
      return
    }

    const totalWidth = Array.from(this.node.querySelectorAll('.category-link'))
      .reduce((acc, node) => {
        return acc + node.getBoundingClientRect().width;
      }, 0);

    this.ratios = Array.from(this.node.querySelectorAll('.category-link'))
      .reduce((acc, node) => {
        const time = node.getBoundingClientRect().width/totalWidth;
        const min = (acc.length > 0) ? acc[acc.length - 1].min + acc[acc.length - 1].time: 0;
        const max = (acc.length > 0) ? acc[acc.length - 1].max + time: time;

        acc.push({
          time,
          max,
          min,
          node,
          t: node.querySelector('.animated')
        });
        return acc;
      }, []);

    this.observer = new IntersectionObserver(([entry]) => {
      const {intersectionRatio} = entry;
      if(intersectionRatio >= 1) {
        this.node.classList.add('visible');
      } else {
        this.node.classList.remove('visible');
      }
    }, {
      threshold: [0., 1.0]
    });

    this.observer.observe(this.node)
  }

  componentWillUnmount() {
    this.observer && this.observer.unobserve(this.node);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {link, label, ...extra} = this.props;

    const onClick = e => {
      e.preventDefault();
      this.context.setRoute(link)
    };

    return <a
      href={link}
      onClick={onClick}
      {...extra}
      ref={node => this.node = node}
      className="category-link__wrapper"
      onMouseEnter={this._animator.onEnter}
      onMouseLeave={this._animator.onLeave}
      onTouchStart={this._animator.onEnter}
      onTouchEnd={this._animator.onLeave}
    >
      {splitLabel(label).map(({word}, i) => (
        <span className="category-link" key={`word_${i}`}>
          <span className="category-link__text">
            {word}
            <span className="animated"></span>
          </span>
          <span className="category-link__underline" />
	      </span>
      ))}
    </a>;
  }
}

function bezierEasing(t, p0, p1) {
  return {
    x: 3. * Math.pow(1. - t, 2.) * t * p0.x + 3. * (1. - t) * Math.pow(t, 2.) * p1.x + Math.pow(t, 3.),
    y: 3. * Math.pow(1. - t, 2.) * t * p0.y + 3. * (1. - t) * Math.pow(t, 2.) * p1.y + Math.pow(t, 3.)
  };
}

function splitLabel(label) {
  let lastIndex = 0;

  const words = [];
  const pattern = /[\s-]/igm;

  while(pattern.exec(label)) {
    const obj = {
      word: label.substring(lastIndex, pattern.lastIndex),
    };
    lastIndex = pattern.lastIndex;
    obj.word = obj.word.replace(' ', '\u00A0');
    words.push(obj);
  }

  words.push({
    word: label.substring(lastIndex),
  });

  return words;
}
