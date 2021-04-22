import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { css, cx } from 'linaria';

import GLSL from '@stilva/glsl';

const canvas = css`
  bottom: 0;
  display: block;
  height: 100vh;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;
  opacity: 1;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 100vw;
  z-index: 0;
`;

export default class Background extends Component {
  componentDidMount() {
    this.glsl = new GLSL(this.el, { webglVersion: 'webgl'});

    // < 0 hide
    // 0. no animation
    // > 0. show
    this.updateDirection = this.glsl.addVariable('u_dir', [!!this.props.previousRoute ? 1.: 0.]);
    this.updateOffset = this.glsl.addVariable('u_offset', [0.]);

    this.glsl.fragment`
    float easeOut(float k) {
      return k == 0. ? 0. : pow(1024., k - 1.);
    }
    
    float easeInOut(float k) {
      if (k == 0.) {
        return 0.;
      }
      if (k == 1.) {
       return 1.;
      }
      if ((k *= 2.) < 1.) {
        return .5 * pow(1024., k - 1.);
      }
      return 0.5 * (-pow(2., -10. * (k - 1.)) + 2.);
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
        
        // entering
        if(u_dir > 0.) {
          float adjusted_time1 = clamp((u_time - u_offset) * 1.25, 0., 1.);
          float adjusted_time2 = clamp((u_time - u_offset) * .85, 0., 1.);
          float adjusted_time3 = clamp((u_time - u_offset) * .75, 0., 1.);
          
          color1 = rect(clamp(1. - easeInOut(adjusted_time1), 0., 1.), uv);
          color2 = rect(clamp(1. - easeInOut(adjusted_time2), 0., 1.), uv);
          color3 = rect(clamp(1. - easeInOut(adjusted_time3), 0., 1.), uv);
        } else if(u_dir == 0.) {
          color1 = rect(0., uv);
          color2 = rect(0., uv);
          color3 = rect(0., uv);
        } else if(u_dir < 0.) {
          float adjusted_time1 = clamp((u_time - u_offset) * .85, 0., 1.);
          float adjusted_time2 = clamp((u_time - u_offset) * 1.05, 0., 1.);
          float adjusted_time3 = clamp((u_time - u_offset) * 1.5, 0., 1.);
          
          color1 = rect(clamp(easeInOut(adjusted_time1), 0., 1.), uv);
          color2 = rect(clamp(easeInOut(adjusted_time2), 0., 1.), uv);
          color3 = rect(clamp(easeInOut(adjusted_time3), 0., 1.), uv);
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
    return typeof document === 'object' && ReactDOM.createPortal( <canvas
      className={canvas}
      ref={node => this.el = node}
      width={400}
      height={400}
    />, document.body);
  }
}
