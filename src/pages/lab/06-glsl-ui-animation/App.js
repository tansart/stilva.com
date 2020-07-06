import React, {useLayoutEffect, useState, useEffect, useMemo, useReducer, useRef} from "react";
import {css, cx} from 'linaria';
import {Animated, useSpring, interpolate} from '@stilva/spring';
import Project from "./Project";

const wrapper = css`
  align-items: center;
  background: #1D1D1D;
  display: flex;
  height: auto;
  justify-content: center;
  margin: 0 auto;
  max-width: 800px;
  overflow: hidden;
  position: relative;
  width: 100%;
  
  &:after {
    content: '';
    display: block;
    height: auto;
    padding-bottom: calc(900/1440 * 100%);
    pointer-events: none;
    position: relative;
    width: 100%;
  }
`;

const text = css`
  background: black;
  display: block;
  height: 15px;
  left: 15px;
  pointer-events: none;
  position: relative;
  top: 15px
`;

const column = css`
  background: #FFFAF5;
  cursor: pointer;
  display: block;
  flex: 0 0 auto;
  height: 40%;
  margin: 0;
  position: absolute;
  width: 20%;
`;

function Section({isVisible}) {
  const [animTitleProps, setAnimTitleProps] = useSpring({ x: 0 });
  const [animCatProps, setAnimCatProps] = useSpring({ x: 0 });

  useEffect(() => {
    setAnimTitleProps({x: isVisible ? 1: 0});
    setAnimCatProps({x: isVisible ? 1: 0})
  }, [isVisible]);

  return <>
    <Animated.span
      className={text}
      style={{
        transform: interpolate(animTitleProps, ({x}) => `scaleX(${x.lastPosition})`),
        transformOrigin: '0 0',
        width: '75%'
      }}
    />
    <Animated.span
      className={text}
      style={{
        margin: '5px 0 0 0',
        transform: interpolate(animCatProps, ({x}) => `scaleX(${x.lastPosition})`),
        transformOrigin: '0 0',
        width: '55%'
      }}
    />
  </>
}

function Column({ dispatcher, index, state, width }) {
  const wrapperRef = useRef();
  const hoveredIndexRef = useRef(state.hoveredIndex);
  hoveredIndexRef.current = state.hoveredIndex;
  const [areChildrenVisible, setChildrenVisibility] = useState(state.hoveredIndex === index);
  const [animatedProps, setAnimatedProps] = useSpring({
    x: 0,
    w: 0
  }, {
    mass: 1,
    tension: 200,
    friction: 26,
    onEnd: () => {
      setChildrenVisibility(hoveredIndexRef.current === index);
    }
  });

  useEffect(() => {
    let x = 0;
    if(index === state.hoveredIndex) {
      x = 0;
    } else if(state.hoveredIndex > -1 && state.hoveredIndex < 3 && state.hoveredIndex > 0) {
      if(state.hoveredIndex < index) {
        x = 1;
      } else {
        x = -1;
      }
    }

    if(state.hoveredIndex !== index) {
      setChildrenVisibility(false);
    }

    setAnimatedProps({
      x,
      w: (state.hoveredIndex === index ? 1: 0)
    });
  }, [state]);

  useEffect(() => {
    if(areChildrenVisible) {
      dispatcher(getDispatcherParams());
    }
  }, [areChildrenVisible]);

  const style = useMemo(() => {
    switch(index) {
      case 0:
        return {
          right: `${Math.round(width * .5)}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${(-width * (.1 + 0.0375) + (width * .05) * x.lastPosition)}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '100% 50%'
        };
      case 1:
        return {
          right: `${Math.round(width * (.5 - .05))}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${(-width * 0.0125 + (width * .05) * x.lastPosition)}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '50% 50%'
        }
      case 2:
        return {
          left: `${Math.round(width * (.5 - .05))}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${(width * 0.0125 + (width * .05) * x.lastPosition)}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '50% 50%'
        }
      case 3:
        return {
          left: `${Math.round(width * .5)}px`,
          transform: interpolate(animatedProps, ({x, w}) => `translate3d(${(width * (.1 + 0.0375) + (width * .05) * x.lastPosition)}px, 0, 0) scaleX(${.5 + .5 * w.lastPosition})`),
          transformOrigin: '0% 50%'
        }
    }
  }, [animatedProps]);

  function getDispatcherParams() {
    const {
      x,
      y,
      height,
      width
    } = wrapperRef.current.getBoundingClientRect();

    const parentRect = wrapperRef.current.parentElement.getBoundingClientRect();

    return {
      type: 'preselect',
      height,
      index,
      x: x - parentRect.x,
      y: y - parentRect.y,
      width
    };
  }

  const isHoverable = state.currentState === 'preselected' || state.currentState === 'hovered' || state.currentState === 'closed';

  return <Animated.div
    className={column}
    onMouseOver={() => isHoverable && dispatcher({ type: 'hover', index })}
    onMouseOut={() => isHoverable && dispatcher({ type: 'hover', index: -1 })}
    ref={wrapperRef}
    style={style}
  >
    <Section
      isVisible={areChildrenVisible}
    />
  </Animated.div>
}

const initialAppState = {
  currentState: 'closed',
  hoveredIndex: -1
};

function appReducer(state, action) {
  switch (action.type) {
    case 'close':
      return {
        ...state,
        currentState: 'closed',
        hoveredIndex: -1
      };
    case 'hover':
      return {
        ...state,
        currentState: 'hovered',
        hoveredIndex: action.index
      };
    case 'preselect':
      if(state.currentState !== 'preselected') {
        return {
          ...state,
          currentState: 'preselected'
        };
      }
    case 'unselect':
      return {
        ...state,
        currentState: 'unselected'
      };
    default:
      throw new Error(`reducer doesn't recognise action::${action.type}`);
  }
}

const preloading = css`
  background: #1D1D1D;
  display: block;
  height: auto;
  overflow: hidden;
  margin: 0 auto;
  max-width: 800px;
  position: relative;
  width: 100%;

&:before {
  content: '';
  display: block;
  max-width: 800px;
  padding-bottom: 62.5%;
  position: relative;
}
`;

const preloadingWhite = css`
  background: #FFFAF5;
  margin: 24px auto 0;
`;

const indexes = Array.from(Array(4), (_, i) => i);
export default function Wrapper({transitionstate}) {
  const ref = useRef(null);
  const [rect, setRect] = useState({width: 0, height: 0});
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  useLayoutEffect(() => {
    if(ref.current) {
      setRect({
        height: ref.current.clientHeight,
        width: ref.current.clientWidth
      });
    }
  }, [transitionstate]);

  useLayoutEffect(() => {
    let resizeObserver;
    const target = ref.current;
    if(target) {
      resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          setRect({
            height: entry.contentRect.height,
            width: entry.contentRect.width
          });
        }
      });

      resizeObserver.observe(target);
    }

    return () => {
      resizeObserver && target && resizeObserver.unobserve(target);
    }
  }, [ref]);

  if(transitionstate !== 'entered') {
    return <>
      <div className={preloading} ref={ref}/>
      <div className={cx(preloading, preloadingWhite)} />
    </>;
  }

  return <>
    <div className={wrapper}>
      {indexes.map((index) => <Column
        dispatcher={dispatch}
        index={index}
        key={`column_${index}`}
        state={state}
        width={rect.width}
      />)}
    </div>
    {rect.height && <Project
      height={rect.height}
      width={rect.width}
    />}
  </>
}

export {
  css
};
