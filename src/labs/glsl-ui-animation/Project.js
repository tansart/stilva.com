import React, {useState, useEffect, useRef} from "react";
import {Animated, useSpring, interpolate} from '@stilva/spring';

import BezierEasing from './bezier';
import Canvas from './Canvas';

function ProjectContent({ showContent }) {
  const [isGLSLActive, setGLSLActive] = useState(false);
  const [opacityProps, setOpacityProps] = useSpring({o: 0}, {
    easing: BezierEasing(1,.0,1,.21),
    duration: 150
  });
  const [textProps, setTextProps] = useSpring({t: .7}, {
    easing: BezierEasing(.71,.72,.5,1),
    duration: 500
  });
  const [imgProps, setImgProps] = useSpring({t: .5}, {
    easing: BezierEasing(.71,.72,.5,1),
    duration: 750,
    onEnd: () => {
      setGLSLActive(true);
    }
  });

  useEffect(() => {
    setTextProps({t: 1});
    setTimeout(() => {
      setImgProps({t: 1});
    }, 250);
  }, []);

  return <Canvas isActive={isGLSLActive}>
    <Animated.span
      style={{
        transform: interpolate(textProps, ({t}) => {
          return `translate3d(0, ${100 - t.lastPosition * 100}%, 0)`;
        })
      }}
    >
      At vero eos et accusus et iusto odio dignissimos
    </Animated.span>
    <Animated.img
      src="/images/lab/folio.png"
      style={{
        transform: interpolate(imgProps, ({t}) => {
          return `translate3d(-50%, ${100 - t.lastPosition * 100}%, 0)`;
        }),
      }}
    />
  </Canvas>
}

export default function Project({ height, width}) {
  const [opacityProps, setOpacityProps] = useSpring({ o: 0 }, {
    easing: BezierEasing(.47,.04,.94,.57),
    duration: 350
  });

  useEffect(() => {
    setOpacityProps({o: 1});
  }, []);

  return <Animated.div
    className="section__project"
    style={{
      'opacity': interpolate(opacityProps, ({o}) => {
        return o.lastPosition;
      }),
      height: `${height}px`,
      width: `${width}px`
    }}
  >
    <Animated.div
      className="section__project-content"
      style={{
        height: `${height}px`,
        width: `${width}px`
      }}
    >
      <ProjectContent />
    </Animated.div>
  </Animated.div>
}
