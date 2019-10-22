import React, {memo, useContext, Component} from 'react';

import GLSL from '@stilva/glsl';
import {RouterContext} from '@stilva/transitionable-react-router';

import Greetings from '../components/Greetings';
import AnimatedLink from '../components/AnimatedLink';
import cx from "classnames";
import useOnScroll from "../hooks/useOnScroll";
import useTransitionDirection from "../hooks/useTransitionDirection";

class Background extends Component {
  componentDidMount() {
    this.glsl = new GLSL(this.el);

    // < 0 hide
    // 0. no animation
    // > 0. show
    this.updateDirection = this.glsl.addVariable('u_dir', [!!this.props.previousRoute ? 1.: 0.]);
    this.updateOffset = this.glsl.addVariable('u_offset', [0.]);

    this.glsl.fragment`float easing(float k) {
      // Quintic
      // return --k * k * k * k * k + 1.;
      // Exponential
      return k == 1. ? 1. : 1. - pow(2., - 10. * k);
    }
    
    float easeOut(float k) {
      return k == 0. ? 0. : pow(1024., k - 1.);
    }
    
    float rect(float t, vec2 uv) {
      vec2 zero = vec2(0., 0.);
      vec2 translate = vec2(t);
      vec2 pt = step(zero, uv + translate);
      return 1. - pt.x * pt.y * step(0., 1.0 - (uv.x + translate.x));
    }

    void main() {
				vec2 uv = gl_FragCoord.xy/u_resolution.xy;
				float color1, color2, color3 = 0.;
        
        if(u_dir > 0.) {
          color1 = rect(1. - easing(min((u_time)/1., 1.)), uv);
          color2 = rect(1. - easing(min((u_time)/1.5, 1.)), uv);
          color3 = rect(1. - easing(min((u_time)/1.75, 1.)), uv);
        }
        
        if(u_dir == 0.) {
          color1 = rect(0., uv);
          color2 = rect(0., uv);
          color3 = rect(0., uv);
        }
        
        if(u_dir < 0.) {
          // 0 is full width, 1. is closed.
          // we want to start from 1 and go to 0.
          float adjusted_time = u_time - u_offset;
          
          color1 = rect(max(easeOut(adjusted_time * 1.5), 0.), uv);
          color2 = rect(max(easeOut(adjusted_time * 1.75), 0.), uv);
          color3 = rect(max(easeOut(adjusted_time * 2.), 0.), uv);
        }

        gl_FragColor = vec4(0., 0., 0., 1.);
        gl_FragColor = mix(gl_FragColor, vec4(0., 0., 0., .9), color3);
        gl_FragColor = mix(gl_FragColor, vec4(0., 0., 0., .15), color2);
        gl_FragColor = mix(gl_FragColor, vec4(0., 0., 0., .0), color1);
			}`;

    this.glsl.render();
  }

  shouldComponentUpdate({transitionstate}) {
    if(transitionstate == 'exiting' && this.props.transitionstate == 'entered') {
      this.updateDirection([-1.]);
      this.updateOffset([(Date.now() - this.glsl._initTime - 250)/1000]);
    }

    return false;
  }

  render() {
    return <canvas
      className="home__background"
      ref={node => this.el = node}
      width={400}
      height={400}
    />;
  }
}

export default memo(function Home({transitionstate}) {
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection('home', transitionstate);
  const {previousRoute} = useContext(RouterContext);

  return <div className={cx('home', 'page', `page--${transitionstate}`, direction)}>
    <div className="content" style={{ top: `-${offset}px`}}>
      <p>
        <Greetings/><br/>
        I'm <AnimatedLink link="https://github.com/stilva" label="Thomas Ansart" target="_blank"/>,
        a senior software engineer at <AnimatedLink link="https://bit.ly/1tx8iPZ" label="Paperless Post" rel="nofollow" target="_blank" />, NY. Previously principal developer at <AnimatedLink link="https://bit.ly/2Mm1IYx" label="Firstborn" rel="nofollow" target="_blank" />
      </p>
      <p>
        My day job involves engineering solutions, creating pixel perfect, and delightful UIs.
      </p>
      <p>
        At night, I spend my time building UIs, writing code, or actively exploring Machine Learning (tensorflow/Python), with my pug Nugget on my laps.
        Check out my <AnimatedLink link="lab" label="Lab" key="lab"/>.
      </p>
      <p>
        From 2007 to early 2019, I worked at various web agencies around the world, for multiple <AnimatedLink link="client" label="major clients" key="client" />
      </p>
      <p>
        Always down for a <AnimatedLink onClick={onContact} label="chat" rel="nofollow"/> over a drink.
      </p>
    </div>
    <Background previousRoute={previousRoute} transitionstate={transitionstate} />
  </div>
});

function onContact(e) {
  e.preventDefault();

  location.href = `mailto:${atob('dGhvbWFzLmFuc2FydEA=')}${atob('c3RpbHZhLmNvbQ==')}`;
}
