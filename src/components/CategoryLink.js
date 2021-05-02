import React, {Component} from "react";
import {css} from 'linaria';

import {RouterContext} from "@stilva/transitionable-react-router";

import { mq } from '../utils/css-utils';

const linkcss = css`
  display: inline-block;
  font-size: 22px;
  overflow: hidden;
  position: relative;
  vertical-align: bottom;
  
  @media ${mq.MS} {
    font-size: 20px;
  }
  
  @media ${mq.ML} {
    font-size: 5.6vw;
  }
  
  @media ${mq.TS} {
    font-size: 36px;
  }
  
  @media ${mq.L} {
    font-size: 42px;
  }
  
  .underline {
    background: black;
    bottom: 0;
    display: block;
    height: 1px;
    left: 0;
    position: absolute;
    transform: translateX(calc(-100% - 1px));
    //transition: transform 250ms cubic-bezier(0,0,.58,1);
    width: 100%;

    // @media ${mq.T} {
    //   height: 2px;
    // }

    .visible & {
      transform: translateX(0);
    }
  }
`;

const text = css`
  color: black;
  display: block;
  position: relative;
  transition: color 250ms ease-out;
  z-index: 1;

  .animated {
    background: black;
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    transform: translateX(calc(-100% - 1px));
    top: 0;
    width: 100%;
    z-index: -1;
  }
`;

const wrapper = css`
  display: block;
  margin-bottom: 1rem;
  position: relative;

  &:hover .${text} {
    color: white;
  }
`;

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

    this._reference = requestAnimationFrame(this._tick);
  };
}

export default class AnimatedLink extends Component {

  static contextType = RouterContext;

  constructor(props) {
    super(props);

    this._animator = new Animator(250, this.update);
  }

  update = (t) => {
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    for(let r of this.ratios) {
      if(t > r.max) {
        r.t.style.transform = `translateX(0%)`;
      } else if(t <= r.min) {
        r.t.style.transform = `translateX(calc(100% + 1px))`;
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

    const totalWidth = Array.from(this.node.querySelectorAll(`.${linkcss}`))
      .reduce((acc, node) => {
        return acc + node.getBoundingClientRect().width;
      }, 0);

    this.ratios = Array.from(this.node.querySelectorAll(`.${linkcss}`))
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
      className={wrapper}
      onMouseEnter={this._animator.onEnter}
      onMouseLeave={this._animator.onLeave}
      onTouchStart={this._animator.onEnter}
      onTouchEnd={this._animator.onLeave}
    >
      {splitLabel(label).map(({word}, i) => (
        <span className={linkcss} key={`word_${i}`}>
          <span className={text}>
            {word}
            <span className="animated" />
          </span>
          <span className="underline" />
	      </span>
      ))}
    </a>;
  }
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
