import React from 'react';
import {css} from 'linaria';
import cx from 'classnames';

import useOnScroll from "../hooks/useOnScroll";
import useTransitionDirection from "../hooks/useTransitionDirection";
import BackButton from "../components/BackButton";
import {mq} from '../utils/css-utils';

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

const baseStyle = css`
  h1 {
    font-family: 'Roboto Mono', monospace;
    font-size: 5.6vw;
    letter-spacing: -0.05em;
    line-height: 1.28;
    font-size: 22px;
    display: block;
    font-weight: 400;
    letter-spacing: -.04vw;
    margin: 0;
    padding: 0 0 1.4vw 0;
    position: relative;
    
    @media ${mq.ML} {
      font-size: 5.6vw;
      padding: 0 0 3vw 0;
    }
    
    @media ${mq.T} {
      font-size: 42px;
      padding: 0 0 22px 0;
    }
  }
  
  h2 {
    display: block;
    font-family: 'Roboto Mono', monospace;
    font-size: 14px;
    //letter-spacing: -0.05em;
    line-height: 1.28;
    margin: 0;
    padding-top: 12px;
    position: relative;
    
    & ~ p {
      margin-top: 6px;
    }
  }
  
  p {
    font-family: 'Roboto Mono', monospace;
    font-size: 14px;
    color: black;
    //letter-spacing: -0.03vw;
    line-height: 1.5;
    margin: .5em 0 1em;
    //word-spacing: 0.05vw;
    
    a {
      border-bottom: 1px solid black;
      color: black;
      display: inline;
      margin: 0;
      position: relative;
      text-decoration: none;
    }
    
    & ~ code {
      margin-top: -.5em;
    }
  }
  
  picture {
    display: block;
    margin: 0 auto;
    position: relative;
    width: 100%;

      img {
        display: block;
        height: auto;
        position: relative;
        width: 100%;
      }
  }
  
  ul {
    display: block;
    list-style-type: none;
    line-height: 2;
    margin: 0;
    padding: 12px 0;
  }
  
  li {
    font-size: 14px;
    color: black;
    //letter-spacing: -0.03vw;
    line-height: 1.5;
    margin-bottom: .5rem;
    word-spacing: 0.05vw;

    &:before {
      content: '\\2013';
      display: inline-block;
      position: relative;
      margin-right: 1rem;
    }
  }
`;

const page = css`
  display: block;
  min-height: 100%;
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

function getContentClass(section, transitionstate, direction) {
  if (section === 'home' && transitionstate === 'exiting') {
    return css`
      animation: animation-rl-out var(--page-transition-duration) cubic-bezier(0,.3,.61,1) both;
    `;
  }

  if (!direction) {
    if (transitionstate === 'entering') {
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

export default function BasePage({backPath, children, section, isList, transitionstate}) {
  const offset = useOnScroll(transitionstate, section);
  const direction = useTransitionDirection(transitionstate);

  let animationType = "animation";

  if (direction === 'page--rl') {
    animationType += '-rl';
  } else {
    animationType += '-lr';
  }

  if (transitionstate === 'exiting') {
    animationType += '-out';
  }

  const contentClass = cx(
    content,
    section !== 'home' && baseStyle,
    getContentClass(section, transitionstate, direction, isList && list)
  );

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
    {backPath && <BackButton path={backPath}/>}
    <div className={contentClass}
         style={{
           top: `-${offset}px`,
           background: offset
         }}>
      {children}
    </div>
  </div>
}
