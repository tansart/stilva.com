import React, {memo, Component} from 'react';

import GLSL from '@stilva/glsl';

import Greetings from '../components/Greetings';
import AnimatedLink from '../components/AnimatedLink';
import cx from "classnames";
import useOnScroll from "../hooks/useOnScroll";
import useTransitionDirection from "../hooks/useTransitionDirection";

class Background extends Component {
  componentDidMount() {
    const glsl = new GLSL(this.el);

    glsl.fragment`void main() {
				vec2 uv = gl_FragCoord.xy/u_resolution.xy;
        
        vec2 zero = vec2(0., 0.);
        // vec2 translate = vec2(sin(u_time) * .5 - .5, 0.);
        vec2 translate = vec2(1., 0.);
        
        vec2 lb = step(zero, uv + translate);
        vec2 rt = step(zero, 1.0 - (uv + translate));
        
        float color1 = lb.x * lb.y * rt.x * rt.y;
        
        gl_FragColor = vec4(color1,color1,color1,1.);
				
			}`;

    glsl.render();
  }

  shouldComponentUpdate() {
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
    <Background />
  </div>
});

function onContact(e) {
  e.preventDefault();

  location.href = `mailto:${atob('dGhvbWFzLmFuc2FydEA=')}${atob('c3RpbHZhLmNvbQ==')}`;
}
