import React from 'react';
import {Animated, useSpring, interpolate} from '@stilva/spring';

export default {
  link: 'spring-animation',
  title: `Spring animation`,
  date: `April 2020`,
  categories: 'web',
  content: [
    {
      type: 'Markdown',
      content: `For most CSS animations, I usually use \`@keyframes\` when there's no interaction, and CSS \`transition\` when there's user interaction.
This obviously isn't always applicable but for most part, \`transition\`'s ability to animate from an arbitrary value works better for interactions.

However, \`transition\` has its own constraint: \`transition-duration\`. For example, a page transition tailored to small screen, won't always feel as nice and smooth on a larger screen. Dynamically tweaking the \`transition-duration\` with some JS with added velocity is usually my lightweight go-to solution.

On React apps, when you can afford adding around \`10kB\` gzipped JS, you can reach out for libraries such as \`react-spring\` (or the original, and smaller \`react-motion\`). For my little lightweight website \`10kB\` is unfortunately way too much.`
    },
    {
      type: 'Markdown',
      content: `In this post, I thought I'd write about a spring component I wrote. But first, let's go through the core requirements that I felt were crucial to a spring component:

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
      content: `Another important feature is the ability to update the DOM node without triggering a Component state update – in other word an imperative implementation with a declarative API.

Additionally just like \`react-spring\` and \`emotionjs\`, I want the ability to have the short-hand notation of \`&lt;Animated.div /&gt;\` over \`&lt;Animated type="div" /&gt;\`.`
    },
    {
      type: 'Markdown',
      content: `
\`\`\`jsx
import {Animated, interpolate, useSpring} from '@stilva/spring';

function MenuButton({}) {
  const [animProps, setAnimProps] = useSpring({
    x: 10,
    y: 50
  }, {
    tension: 195
  });

  return &lt;Animated.button
    style={{
      transform: interpolate(animProps, ({x, y}) => \`translate3d($\{x\}px, $\{y\}px, 0)\`)
    }}
    onClick={e => setAnimProps({x: 100, y: 100})}
  &gt;
    Hover on me!
  &lt;/Animated.button&gt;
}
\`\`\`
`
    },
    {
      type: 'FunctionalComponent',
      css: `
  .my-button {
    background: none;
    border: none;
    cursor: pointer;
    display: block;
    outline: none;
    overflow: hidden;
    position: relative;
    --translateX: 0;
  }
  
  .my-button:before {
    background: red;
    bottom: 0;
    content: '';
    display: block;
    height: 100%;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    transform: var(--translateX);
    width: 100%;
    z-index: -1;
  }
`,
      component: function () {
        const [animatedProps, setAnimatedProps] = useSpring({
          x: -100
        }, { tension: 170});

        return <Animated.button
          className="my-button"
          style={{
            '--translateX': interpolate(animatedProps, ({x}) => `translate3d(calc(${x.lastPosition}% - 1px), 0, 0)`),
          }}
          onMouseOver={() => setAnimatedProps({x: 0})}
          onMouseOut={() => setAnimatedProps({x: -100})}
        >
          Hover on me!
        </Animated.button>;
      }
    },
  ]
};
