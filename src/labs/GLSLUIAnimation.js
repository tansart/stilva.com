import React, { useEffect, useMemo, useState } from 'react';

import GLSL from '@stilva/glsl';
import {Animated, useSpring, interpolate} from '@stilva/spring/src';

function Canvas({index, onClick, onHover, selectedIndex, width, xOffset}) {
  const node = React.useRef();
  const prevStopped = React.useRef(false);
  const [stopped, setStopped] = React.useState(false);
  const [animatedProps, setAnimatedProps] = useSpring({
    x: 1,
    xOffset: 0
  });

  React.useEffect(() => {
    setAnimatedProps({
      x: selectedIndex === index ? 2: 1,
      xOffset
    });
  }, [selectedIndex, xOffset]);

  React.useEffect(() => {
    setStopped(s => {
      const nState = (stopped !== prevStopped && stopped) ? true: s;
      prevStopped.current = stopped;
      return nState;
    });
  }, [stopped]);

  React.useEffect(() => {
    const glsl = new GLSL(node.current);
    glsl.addVariable('u_delta', [0, 2, 4]);
    glsl.fragment`void main() {
      vec2 uv = gl_FragCoord.xy/u_resolution.xy;
      gl_FragColor = vec4(uv, uv.y, 1.);
    }`;

    glsl.render();

    return () => {
      glsl.kill();
    }
  }, []);

  return <Animated.canvas
    className="canvas"
    height={530}
    width={width}
    onMouseOut={() => {
      !stopped && onHover(null);
    }}
    onMouseOver={() => {
      !stopped && onHover(index);
    }}
    onClick={() => {
      setStopped(true);
      animatedProps.pause();
      onClick(node.current.getBoundingClientRect())
    }}
    ref={node}
    style={{
      transformOrigin: index > 0 ? ( index < 3 ? '50%': '0% 50%'): '100% 50%',
      '--translateX': interpolate(animatedProps, ({x, xOffset}) => `translate3d(${xOffset.lastPosition}px, 0, 0) scaleX(${x.lastPosition})`),
    }}
  />
}

function _Section({onClose, close, sx, sy, x, y}) {
  const node = React.useRef();
  const [animatedProps, setAnimatedProps] = useSpring({
    sx: sx,
    sy: sy,
    tx: x,
    ty: y
  }, {
    mass: 1,
    tension: 175,
    friction: 28
  });

  React.useEffect(() => {
    setAnimatedProps({
      sx: 1,
      sy: 1,
      tx: 0,
      ty: 0
    });
  }, []);

  React.useEffect(() => {
    const glsl = new GLSL(node.current);
    glsl.fragment`void main() {
      vec2 uv = gl_FragCoord.xy/u_resolution.xy;
      gl_FragColor = vec4(uv, uv.y, 1.);
    }`;

    glsl.render();

    return () => {
      glsl.kill();
    }
  }, []);

  return <Animated.canvas
    className="section"
    onClick={onClose}
    ref={node}
    style={{
      left: `0px`,
      height: `${window.innerHeight}px`,
      top: `0px`,
      transformOrigin: '0 0',
      transform: interpolate(animatedProps, ({sx, sy, tx, ty}) => `translate3d(${tx.lastPosition}px, ${ty.lastPosition}px, 0) scale(${sx.lastPosition}, ${sy.lastPosition})`),
      width: `${window.innerWidth}px`
    }}
  />
}

function _Wrapper() {
  const [selectedIndex, setSelected] = React.useState(null);
  const [focused, setFocused] = React.useState(null);

  const setOnHover = (index) => {
    setSelected(index);
  }

  const onClose = () => {
    setFocused({
      sx: 1,
      sy: 1,
      tx: 0,
      ty: 0
    });
  }

  return <div
    className="wrapper"
  >
    {focused && <Section
      onClose={onClose}
      x={focused.x}
      y={focused.y}
      sx={focused.width/window.innerWidth}
      sy={focused.height/window.innerHeight}
    />}
    <Canvas
      index={0}
      onClick={setFocused}
      onHover={setOnHover}
      selectedIndex={selectedIndex}
      xOffset={getOffset(selectedIndex, 0)}
      width={140}
    />
    <Canvas
      index={1}
      onClick={setFocused}
      onHover={setOnHover}
      selectedIndex={selectedIndex}
      xOffset={getOffset(selectedIndex, 1)}
      width={140}
    />
    <Canvas
      index={2}
      onClick={setFocused}
      onHover={setOnHover}
      selectedIndex={selectedIndex}
      xOffset={getOffset(selectedIndex, 2)}
      width={140}
    />
    <Canvas
      index={3}
      onClick={setFocused}
      onHover={setOnHover}
      selectedIndex={selectedIndex}
      xOffset={getOffset(selectedIndex, 3)}
      width={140}
    />
  </div>
}

function getOffset(selectedIndex, index) {
  if(selectedIndex === index || typeof selectedIndex !== 'number') {
    return 0;
  }

  if(selectedIndex === 0 || selectedIndex === 3) {
    return 0;
  }

  if(selectedIndex > index) {
    return -70;
  }

  return 70;
}

function Section({isVisible}) {
  const [animTitleProps, setAnimTitleProps] = useSpring({ x: 0 });
  const [animCatProps, setAnimCatProps] = useSpring({ x: 0 });

  useEffect(() => {
    setAnimTitleProps({x: isVisible ? 1: 0});
    setAnimCatProps({x: isVisible ? 1: 0})
  }, [isVisible]);

  return <>
    <Animated.span
      className="section__text"
      style={{
        transform: interpolate(animTitleProps, ({x}) => `scaleX(${x.lastPosition})`),
        transformOrigin: '0 0',
        width: '75%'
      }}
    />
    <Animated.span
      className="section__text"
      style={{
        margin: '5px 0 0 0',
        transform: interpolate(animCatProps, ({x}) => `scaleX(${x.lastPosition})`),
        transformOrigin: '0 0',
        width: '55%'
      }}
    />
  </>
}

function Column({index, offset, onMouseOut, onMouseOver, selectedIndex}) {
  const [animComplete, setAnimComplete] = useState({
    selected: index === selectedIndex,
    done: false
  });

  const [animatedProps, setAnimatedProps] = useSpring({
    x: 0,
    w: 0
  }, {
    mass: 1,
    tension: 200,
    friction: 26,
    onEnd: () => {
      setAnimComplete(s => ({
        selected: s.selected,
        done: !!s.selected
      }));
    }
  });

  useEffect(() => {
    let x = 0;
    if(index === selectedIndex) {
      x = 0;
    } else if(selectedIndex > -1 && selectedIndex < 3 && selectedIndex > 0) {
      if(selectedIndex < index) {
        x = 1;
      } else {
        x = -1;
      }
    }

    setAnimComplete(s => ({
      selected: index === selectedIndex,
      done: selectedIndex === -1 ? false: s.done
    }));

    setAnimatedProps({
      x,
      w: (selectedIndex === index ? 1: 0)
    });
  }, [index, selectedIndex]);

  const style = useMemo(() => {
    switch(index) {
      case 0:
        return {
          right: `${Math.round(800 * .5)}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${Math.round(-800 * (.1 + 0.0375) + (800 * .05) * (x.lastPosition))}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '100% 50%'
        };
      case 1:
        return {
          right: `${Math.round(800 * (.5 - .05))}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${Math.round(-800 * 0.0125 + (800 * .05) * (x.lastPosition))}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '50% 50%'
        }
      case 2:
        return {
          left: `${Math.round(800 * (.5 - .05))}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${Math.round(800 * 0.0125 + (800 * .05) * (x.lastPosition))}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '50% 50%'
        }
      case 3:
        return {
          left: `${Math.round(800 * .5)}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${Math.round(800 * (.1 + 0.0375) + (800 * .05) * (x.lastPosition))}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '0% 50%'
        }
    }
  }, [animatedProps]);

  return <Animated.div
    className="column"
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
    style={style}
  >
    <Section
      isVisible={animComplete.done}
    />
  </Animated.div>
}

const offsets = Array(4).fill(null);
function Wrapper({}) {
  const [selected, setSelected] = useState(-1);

  return <div className="wrapper">
    {offsets.map((offset, index) => <Column
      key={`column_${index}`}
      index={index}
      offset={offset}
      onMouseOut={() => setSelected(-1)}
      onMouseOver={() => setSelected(index)}
      selectedIndex={selected}
    />)}
  </div>
}

export default {
  link: 'glsl-ui-animation',
  title: `GLSL UI animation`,
  date: `May 2020`,
  categories: 'web',
  content: [
    {
      type: 'Markdown',
      content: ``
    },
    {
      type: 'FunctionalComponent',
      css: `
.wrapper {
  align-items: center;
  background: #1D1D1D;
  display: flex;
  height: ${Math.round(900/1440 * 800)}px;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  width: 800px;
}

.column {
  background: white;
  cursor: pointer;
  display: block;
  flex: 0 0 auto;
  height: 40%;
  margin: 0;
  position: absolute;
  width: 20%;
}

.section__text {
  background: black;
  display: block;
  height: 15px;
  left: 15px;
  position: relative;
  top: 15px
}
`,
      component: function () {
        return <Wrapper />
      }
    }
  ]
};
