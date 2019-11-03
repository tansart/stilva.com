import React, {Component} from "react";
import cx from 'classnames';

import {RouterContext} from "@stilva/transitionable-react-router";
import lab from "../lab";

export default class AnimatedLink extends Component {

  static contextType = RouterContext;

  constructor(props) {
    super(props);

    this.__isHovering = false;
  }

  onEnter = () => {
    let currIndex = 0;
    const {ratios} = this;
    const maxTime = 250;
    const initTime = Date.now();

    this.__isHovering = true;

    console.log(ratios)

    const update = () => {
      const now = Date.now();
      const tick = (now - initTime)/maxTime;

      if(!this.__isHovering) {
        return null;
      }

      if(tick >= ratios[currIndex].max && ratios.length - 1 >= currIndex + 1) {
        ratios[currIndex].t.style.transform = `translateX(0%)`;
        currIndex++;
      }

      if(maxTime > (now - initTime)) {
        requestAnimationFrame(update);

        const transform = (tick - ratios[currIndex].min)/ratios[currIndex].time * 100 - 105;
        ratios[currIndex].t.style.transform = `translateX(${Math.min(transform, 0)}%)`;
      } else {
        console.log(now - initTime);
        ratios[currIndex].t.style.transform = `translateX(0%)`;
      }
    };

    requestAnimationFrame(update);
  };

  onLeave = () => {
    this.__isHovering = false;

    this.ratios.forEach(({node}) => {
      node.querySelector('.animated').style.transform = '';
    })
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
        console.log(this.props.label)
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
      onMouseEnter={this.onEnter}
      onMouseLeave={this.onLeave}
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

function splitLabel(label) {
  let lastIndex = 0;

  const words = [];
  const pattern = /[\s-–]/igm;

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
