import React, {useEffect, useState} from 'react';
import {Animated, useSpring, interpolate} from '@stilva/spring';

export default {
  link: 'spring-animation',
  title: `Spring animation`,
  date: `April 2020`,
  categories: 'web',
  content: [
    {
      type: 'Markdown',
      content: `In React apps, when you can afford adding around \`10kB\` of gzipped JS, you can reach out for libraries such as \`react-spring\` (or the original, and smaller \`react-motion\`).
For my little lightweight website \`10kB\` is unfortunately way too much. So I wrote a smaller spring library.

Before let's go through the core requirements that I felt were crucial to a spring component:

* configurability of mass, tension, friction etc
* \`Animated.div\` Component with a declarative API, but a direct DOM manipulation behind the scene.
* hooks API such as \`useSpring(animationProperties, springConfig)\`
`
    },
    {
      type: 'Markdown',
      content: `Instead of re-implementing the velocity calculation, I've forked the core frame loop function from \`react-spring\`'s [frameLoop.ts](https://github.com/react-spring/react-spring/blob/master/src/animated/FrameLoop.ts) update function and trimmed it down to only support spring animations (e.g. no easing/time based support).`
    },
    {
      type: 'Markdown',
      content: `The other important feature is the ability to update the DOM node without triggering a Component state update. For its API, I wanted the ability to have the short-hand notation of \`&lt;Animated.div /&gt;\` over \`&lt;Animated type="div" /&gt;\` – the same notation as \`react-spring\` and \`emotionjs\``
    },
    {
      type: 'Markdown',
      content: `Thanks to \`React.forwardRef\` this is a simple API to implement. Here's one implementation:

\`\`\`javascript
['div', 'span', /* 100+ more hard-coded tags here */].forEach(element => Animated[element] = React.forwardRef()); \`\`\`
`
    },
    {
      type: 'Markdown',
      content: `Luckily ES6 metaprogramming ability (\`Proxy\`) comes to the rescue (one of the very few times where using ES6 Proxy came in very handy while building UIs...). It saves a few \`kB\` :).
The downside is we lose the transpile-time error feedback, and the IDE intellisense – worsened DX for a slightly better UX.

\`\`\`jsx
const AnimatedInstances = {};
export default new Proxy(AnimatedBase, {
  get(obj, type) {
    return AnimatedInstances[type] || (AnimatedInstances[type] = React.forwardRef();
  }
}); \`\`\`
`
    },
    {
      type: 'Markdown',
      content: `One thing to note: \`AnimatedInstances\` is there so we don't constantly create new components with \`React.forwardRef()\`.`
    },
    {
      type: 'Markdown',
      content: `Let's dive into a simple example – I'll shamelessly borrow the example \`react-spring\` has on their documentation page.


\`\`\`jsx
import {Animated, interpolate, useSpring} from '@stilva/spring';

function MenuButton({}) {
  const {x, y} = useMouse();
  const [animatedProps, setAnimatedProps] = useSpring({
    x: 1,
    y: 0
  }, {
    mass: 3,
    tension: 170,
    friction: 14
  });
  
  useEffect(() =&gt; {
    setAnimatedProps({
      x, y
    });
  }, [x, y])
  
  return &lt;div className="wrapper"&gt;
    &lt;Animated.div
      className="square"
      style={{
        '--transform': interpolate(animatedProps, ({x, y}) =&gt; \`rotateX(\${-20 * y.lastPosition}deg) rotateY(\${20 * x.lastPosition}deg)\`),
      }}
    >
      {Date.now()}
    &lt;/Animated.div&gt;
  &lt;/div&gt;
} \`\`\`

And here's what we get:
`
    },
    {
      type: 'FunctionalComponent',
      css: `
.wrapper {
  align-items: center;
  display: flex;
  justify-content: center;
  padding: 26px 0;
  width: 100%;
}

.square {
  align-items: center;
  background: #f8205d;
  border-radius: 8px;
  display: flex;
  height: 250px;
  justify-content: center;
  position: relative;
  transform: perspective(400px) var(--transform);
  width: 250px;
}
`,
      component: function () {
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

        return <div className="wrapper">
          <Animated.div
            className="square"
            style={{
              '--transform': interpolate(animatedProps, ({x, y}) => `rotateX(${-20 * y.lastPosition}deg) rotateY(${20 * x.lastPosition}deg)`),
            }}
          >
            {Date.now()}
          </Animated.div>
        </div>
      }
    },
    {
      type: 'Markdown',
      content: `A few things to note:
* \`useMouse\` throttles the callbacks to once every 50ms.
* The square has \`Date.now()\` so you can see how often the state updates.
* \`Animatmed.div\` can animate independently of state updates, and keeps track of animations
* This is probably not the best example, since you could achieve similar results with a mixture of CSS \`transition\` and the same \`useMouse\` hook I've used.
`
    }
  ]
};

function throttle(fn) {
  let now = Date.now();
  let last = now;

  return (e) => {
    now = Date.now();
    if(now - last > 50) {
      last = now;
      fn(e);
    }
  };
}

function useMouse() {
  const [delta, setDelta] = React.useState({x: 0, y: 0});

  useEffect(() => {
    const sq = document.querySelector('.square');
    const move = throttle(e => {
      const {x, y} = getXY(e);

      setDelta({
        x:1 - x / 250 * 2,
        y:1 - y / 250 * 2
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
