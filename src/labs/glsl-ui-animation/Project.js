import React, {useState, useEffect, useRef} from "react";
import {Animated, useSpring, interpolate} from '@stilva/spring';

import BezierEasing from './bezier';
import Canvas from './Canvas';

function ProjectContent() {
  return <Canvas>
    <span >
      At vero eos et accusus et iusto odio dignissimos
    </span>
    <img
      src="/images/lab/folio.png"
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
