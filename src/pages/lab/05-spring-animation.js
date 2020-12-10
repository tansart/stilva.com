import React, {memo, useEffect} from 'react';
import {css} from 'linaria';

import Code from '../../components/Code';
import {Animated, interpolate, useSpring} from "@stilva/spring";

const button = css`
  background: none;
  border: none;
  border-radius: 0;
  color: #feb2a8;
  cursor: pointer;
  font-size: 16px;
  outline: none;
  overflow: hidden;
  position: relative;
  text-align: left;
  
  &:after {
    background: white;
    content: '';
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transform: translateX(calc(-100% - 1px));
    transition: transform 350ms ease-out;
    width: 100%;
    z-index: -1;
  }
  
  &:hover:after {
    transform: translateX(0);
  }
`;

const splitButton = css`
  background: none;
  border: none;
  border-radius: 0;
  color: #feb2a8;
  cursor: pointer;
  display: block;
  font-size: 16px;
  outline: none;
  overflow: hidden;
  position: relative;
  
  span {
    display: inline-block;
    overflow: hidden;
    position: relative;

    &:after {
      background: white;
      content: '';
      display: block;
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      transform: translateX(calc(-100% - 1px));
      transition: transform 150ms cubic-bezier(0,0,0,1);
      width: 100%;
      z-index: -2;
    }
  }
  
  .one:after,
  &:hover .three:after {
    transition-delay: 300ms;
  }
  .two:after,
  &:hover .two:after {
    transition-delay: 150ms;
  }
  .three:after,
  &:hover .one:after {
    transition-delay: 0ms;
  }
  
  &:hover span:after {
    transform: translateX(0%);
  }
`;

const svg = css`
  display: block;
  height: 200px;
  margin: 0 auto;
  position: relative;
  width: 200px;

  line,
  path {
    fill: none;
    stroke-width: 5;
  }
  
  circle {
    stroke-width: 5;
  }
`;

export default memo(function () {
  return <>
    <h1>Spring animation</h1>
    <p>
      In React apps, when you can afford adding around <code>10kB</code> of gzipped JS, you can reach out for
      libraries such as <code>react-spring</code> (or the original, and smaller <code>react-motion</code>).
      For my little lightweight website <code>10kB</code> is unfortunately way too much. So I wrote a smaller spring
      library.
    </p>
    <p>
      First, let's go through the core requirements that I felt were crucial to a spring component:
    </p>
    <ul>
      <li>configurability of mass, tension, friction etc</li>
      <li><code>Animated.div</code> Component with a declarative API, but a direct DOM manipulation behind the scene.
      </li>
      <li>hooks API such as <code>useSpring(animationProperties, springConfig)</code></li>
    </ul>
    <p>
      Instead of re-implementing the velocity calculation, I've forked the core frame loop function
      from <code>react-spring</code>'s <a
      href="https://github.com/react-spring/react-spring/blob/master/src/animated/FrameLoop.ts">frameLoop.ts</a> update
      function and trimmed it down to only support spring animations (e.g. no easing/time based support).
    </p>
    <p>
      The other important feature is the ability to update the DOM node without triggering a Component state update.
      For its API, I wanted the ability to have the short-hand notation of <code>&lt;Animated.div
      /&gt;</code> over <code>&lt;Animated type="div" /&gt;</code> – the same notation
      as <code>react-spring</code> and <code>emotionjs</code>
    </p>
    <p>
      Thanks to <code>React.forwardRef</code> this is a simple API to implement. Here's one implementation:
    </p>
    <Code lan="javascript">
      {`
['div', 'span', /* 100+ more hard-coded tags here */].forEach(element => Animated[element] = React.forwardRef()); 
        `}
    </Code>
    <p>
      Luckily ES6 metaprogramming ability (<code>Proxy</code>) comes to the rescue (one of the very few times where
      using ES6 Proxy came in very handy while building UIs...). It saves a few <code>kB</code> :).
      The downside is we lose the transpile-time error feedback, and the IDE intellisense – worsened DX for a slightly
      better UX.
    </p>
    <Code lan="javascript">
      {`
const AnimatedInstances = {};
export default new Proxy(AnimatedBase, {
  get(obj, type) {
    return AnimatedInstances[type] || (AnimatedInstances[type] = React.forwardRef();
  }
}); 
        `}
    </Code>
    <p>
      One thing to note: <code>AnimatedInstances</code> is there so we don't constantly create new components
      with <code>React.forwardRef()</code>.
    </p>
    <p>Let's dive into a simple example – I'll shamelessly borrow the example <code>react-spring</code> has on their
      documentation page.
    </p>
    <Code lan="jsx">
      {`
import {Animated, interpolate, useSpring} from '@stilva/spring';

function Square({}) {
  const {x, y} = useMouse();
  const [animatedProps, setAnimatedProps] = useSpring({
    x: 1,
    y: 0
  }, {
    mass: 3,
    tension: 170,
    friction: 14
  });
  
  useEffect(() => {
    setAnimatedProps({
      x, y
    });
  }, [x, y])
  
  return \<div className="wrapper">
    \<Animated.div
      className="square"
      style={{
        '--transform': interpolate(animatedProps, ({x, y}) => \`rotateX($\{-20 * y.lastPosition}deg) rotateY($\{20 * x.lastPosition}deg)\`),
      }}
    >
      {Date.now()}
    \</Animated.div>
  \</div>
}
        `}
    </Code>
    <p>
      And here's what we get (move your mouse around the square):
    </p>
    <Example/>
    <p>
      A few things to note:
    </p>
    <ul>
      <li><code>useMouse</code> throttles the callbacks to once every 50ms.</li>
      <li>The square has <code>Date.now()</code> so you can see how often the state updates.</li>
      <li><code>Animatmed.div</code> can animate independently of state updates, and keeps track of animations</li>
      <li>This is probably not the best example, since you could achieve similar results with a mixture of
        CSS <code>transition</code> and the same <code>useMouse</code> hook I've used.
      </li>
    </ul>
  </>
});

const wrapper = css`
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 26px 0;
  width: 100%;
`

const square = css`
  align-items: center;
  background: #f8205d;
  border-radius: 8px;
  display: flex;
  height: 250px;
  justify-content: center;
  position: relative;
  transform: perspective(400px) var(--transform);
  width: 250px;
`;

function Example() {
  const {x, y} = useMouse();
  const [animatedProps, setAnimatedProps] = useSpring({
    x: 1,
    y: 0
  }, {
    mass: 3,
    tension: 210,
    friction: 14
  });

  useEffect(() => {
    setAnimatedProps({
      x, y
    });
  }, [x, y])

  return <div className={wrapper}>
    <Animated.div
      className={square}
      style={{
        '--transform': interpolate(animatedProps, ({x, y}) => `rotateX(${-20 * y.lastPosition}deg) rotateY(${20 * x.lastPosition}deg)`),
      }}
    >
      {Date.now()}
    </Animated.div>
  </div>
}

function throttle(fn) {
  let now = Date.now();
  let last = now;

  return (e) => {
    now = Date.now();
    if (now - last > 50) {
      last = now;
      fn(e);
    }
  };
}

function useMouse() {
  const [delta, setDelta] = React.useState({x: 0, y: 0});

  useEffect(() => {
    const sq = document.querySelector(`.${square}`);
    const move = throttle(e => {
      const {x, y} = getXY(e);

      setDelta({
        x: 1 - x / 250 * 2,
        y: 1 - y / 250 * 2
      })
    });

    sq.addEventListener('mousemove', move);
    return () => {
      sq.removeEventListener('mousemove', move);
    };
  }, []);

  return delta;
}

function getXY(e) {
  return {
    x: e.layerX,
    y: e.layerY
  }
}
