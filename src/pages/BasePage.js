import React, {memo, useContext, Component} from 'react';
import { css } from 'linaria';
import cx from 'classnames';
import {RouterContext} from "@stilva/transitionable-react-router";

import useOnScroll from "../hooks/useOnScroll";
import useTransitionDirection from "../hooks/useTransitionDirection";
import BackButton from "../components/BackButton";
import { mq } from '../utils/css-utils';

const content = css`
  display: block;
  position: relative;
  margin: 0 auto;
  max-width: 960px;
  z-index: 1;
  
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes animation-rl {
    from {
      transform: translate3d(100vw, 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  
  @keyframes animation-rl-out {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(-100vw, 0, 0);
    }
  }
  
  @keyframes animation-lr {
    from {
      transform: translate3d(-100vw, 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  
  @keyframes animation-lr-out {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(100vw, 0, 0);
    }
  }
`;

const page = css`
  display: block;
  min-width: 100vw;
  overflow: hidden;
  padding: 86px 20px;
  width: 100vw;
  
  @media ${mq.TS} {
    padding: 86px;
  }
  
  // .home ~ .page .back-button {
    // animation: fade-in 250ms ease-out 750ms both;
  // }
`;

const list = css`
  margin: 0;
`;

const entering = css`
  background: transparent;
  bottom: 0;
  left: 0;
  min-height: 100vh;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 3;
`;

const exiting = css`
  background: transparent;
  bottom: 0;
  left: 0;
  min-height: 100vh;
  position: relative;
  right: 0;
  top: 0;
`;

const exited = css`
  display: none;
`;

function contentClass(section, transitionstate, direction) {
  if(section === 'home' && transitionstate === 'exiting') {
    return css`
      animation: animation-rl-out var(--page-transition-duration) cubic-bezier(0,.3,.61,1) both;
    `;
  }

  if(!direction) {
    if(transitionstate === 'entering') {
      return css`
        animation-timing-function: cubic-bezier(.3,.86,.68,1);
      `;
    } else {
      return css`
        animation-timing-function: cubic-bezier(.75,.43,.7,1);
      `;
    }
  }

  return css`
    animation: var(--page-transition-duration) var(--page-transition-animation) both;
  `;
}

export default function BasePage({background, backPath, children, section, isList, transitionstate}) {
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection(transitionstate);
  const {previousRoute} = useContext(RouterContext);

  let animationType = "animation";

  if(direction === 'page--rl') {
    animationType += '-rl';
  } else {
    animationType += '-lr';
  }

  if(transitionstate === 'exiting') {
    animationType += '-out';
  }

  return <div
    className={cx([
      section,
      page,
      transitionstate === 'entering' && entering,
      transitionstate === 'exiting' && exiting,
      transitionstate === 'exited' && exited,
    ])}
    style={{'--page-transition-animation': animationType}}
  >
    {backPath && <BackButton path={backPath} />}
    <div className={cx([content, contentClass(section, transitionstate, direction, isList && list,)])} style={{ top: `-${offset}px`}}>
      {children}
    </div>
    {background && React.createElement(background, {previousRoute, transitionstate})}
  </div>
}
