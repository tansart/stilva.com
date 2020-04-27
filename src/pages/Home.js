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
    
    float noise(vec2 u) {
        // return fract(sin(u.x * 7.)*92.*cos(u.y *9.)*39.);
        return fract(dot(sin(cos(u.x * 3.14) * 123.12)*142.,cos(u.y *34.95)*165.47));
    }
    
    vec2 bezier(float t, vec4 p) {
      return 3. * pow(1. - t, 2.) * t * p.rg + 3. * (1. - t) * pow(t, 2.) * p.ba + pow(t, 3.);
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
        float adjusted_time = clamp((u_time - u_offset) / .85, 0., 1.);
        
        if(u_dir > 0.) {
          color1 = rect(clamp(1. - bezier(adjusted_time, vec4(0., .68, 0., .99)).y, 0., 1.), uv);
          color2 = rect(clamp(1. - bezier(adjusted_time, vec4(0., .31, 0., .82)).y, 0., 1.), uv);
          color3 = rect(clamp(1. - bezier(adjusted_time, vec4(.73, .0, .51, .99)).y, 0., 1.), uv);
        }
        
        if(u_dir == 0.) {
          color1 = rect(0., uv);
          color2 = rect(0., uv);
          color3 = rect(0., uv);
        }
        
        if(u_dir < 0.) {
          color1 = rect(clamp(bezier(adjusted_time, vec4(.73, .0, .51, .99)).y, 0., 1.), uv);
          color2 = rect(clamp(bezier(adjusted_time, vec4(0., .31, 0., .82)).y, 0., 1.), uv);
          color3 = rect(clamp(bezier(adjusted_time, vec4(0., .68, 0., .99)).y, 0., 1.), uv);
        }

        gl_FragColor = vec4(0., 0., 0., 1.);
        gl_FragColor = mix(gl_FragColor, vec4(0., 0., 0., .9), color3);
        gl_FragColor = mix(gl_FragColor, vec4(0., 0., 0., .85), color2);
        gl_FragColor = mix(gl_FragColor, vec4(0., 0., 0., 0.), color1);
			}`;

    this.glsl.render();
  }

  componentWillUnmount() {
    this.glsl.kill();
  }

  shouldComponentUpdate({transitionstate}) {
    if(transitionstate == 'exiting' && this.props.transitionstate == 'entered') {
      this.updateDirection([-1.]);
      this.updateOffset([(Date.now() - this.glsl._initTime)/1000]);
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
  const direction = useTransitionDirection(transitionstate);
  const {previousRoute} = useContext(RouterContext);

  return <div className={cx('home', 'page', `page--${transitionstate}`, direction)}>
    <div className="content" style={{ top: `-${offset}px`}}>
      <p>
        <Greetings/><br/>
        I'm <AnimatedLink link="https://github.com/stilva" label="Thomas Ansart" target="_blank" rel="noreferrer" />,
        a senior software engineer at Paperless Post, NY. Previously principal developer at Firstborn.
      </p>
      <p>
        My day job involves engineering solutions, creating pixel perfect, and delightful UIs. Here's some of my <AnimatedLink link="work" label="work" key="lab"/>.
      </p>
      <p>
        At night, I spend my time building UIs, writing code, or actively exploring Machine Learning (tensorflow/Python), with my pug Nugget on my laps.
        Check out my <AnimatedLink link="lab" label="Lab" key="lab"/>.
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
