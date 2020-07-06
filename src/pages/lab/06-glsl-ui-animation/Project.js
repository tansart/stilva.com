import React, {useEffect} from "react";
import {Animated, useSpring, interpolate} from '@stilva/spring';
import {css} from 'linaria';

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

const section = css`
  --translateXY: 0;
  --scale: 0;
  left: 0;
  margin: 24px auto 0;
  overflow: hidden;
  position: relative;
  top: 0;
  white-space: nowrap;
  z-index: 1;
`;

const content = css`
  background: #FFFAF5;
  display: block;
  left: 0;
  position: absolute;
  top: 0;
  transform: translate3d(var(--translateXY), 0) scale(var(--scale));
  transform-origin: 0% 0%;
`;

export default function Project({ height, width}) {
  const [opacityProps, setOpacityProps] = useSpring({ o: 0 }, {
    easing: BezierEasing(.47,.04,.94,.57),
    duration: 350
  });

  useEffect(() => {
    setOpacityProps({o: 1});
  }, []);

  return <Animated.div
    className={section}
    style={{
      'opacity': interpolate(opacityProps, ({o}) => {
        return o.lastPosition;
      }),
      height: `${height}px`,
      width: `${width}px`
    }}
  >
    <Animated.div
      className={content}
      style={{
        height: `${height}px`,
        width: `${width}px`
      }}
    >
      <ProjectContent />
    </Animated.div>
  </Animated.div>
}
