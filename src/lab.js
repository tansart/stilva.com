import React from 'react';

export default {
  'splitting-cubic-bezier': {
    link: 'splitting-cubic-bezier',
    title: `Splitting a cubic bézier curve`,
    date: `November 2019`,
    categories: 'web',
    content: [
      {
        type: 'Markdown',
        content: `Before diving into how to split a cubic bezier curve into multiple chunks, let's take a step back for a little context.
Let's write a very simple button component where we have a background animation.`
      },
      {
        type: 'FunctionalComponent',
        css: `.scb-button {
          background: none;
          border: none;
          border-radius: 0;
          color: #feb2a8;
          cursor: pointer;
          font-size: 16px;
          outline: none;
          overflow: hidden;
          position: relative;
        }
        .scb-button:after {
          background: white;
          content: '';
          display: block;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          transform: translateX(-105%);
          transition: transform 350ms ease-out;
          width: 100%;
          z-index: -1;
        }
        .scb-button:hover:after {
          transform: translateX(0);
        }`,
        component: function component() {
          return <button className='scb-button' type="button">
            hover
          </button>;
        }
      },
      {
        type: 'Markdown',
        content: `There's a very straight-forward hover animation, with a pseudo element that has a \`transform: translateX();\` applied on hover.
There's also a simple \`ease-out\` applied to the \`transition\` so it's nice a smooth.

Things quickly get ugly when you need the button's animation to be split in two or more lines.`
      },
      {
        type: 'FunctionalComponent',
        css: `.max-width {
          max-width: 100px;
          text-align: left;
        }`,
        component: function component() {
          return <button className='scb-button max-width' type="button">
            Split in multiple lines.
          </button>;
        }
      },
      {
        type: 'Markdown',
        content: `First CSS property that came to mind was \`box-decoration-break: clone;\`. Unfortunately I needed the display element to be a \`block\`, or an \`inline-block\`.
So this wouldn't work.

The next step was splitting the button in smaller components and applying multiple \`transition-delay\` along sub-elements to offset the transition on each sub-elements.`
      },
      {
        type: 'FunctionalComponent',
        css: `.scb-button--split, .scb-button--split span {
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
        }
        .scb-button--split span {
          display: inline-block;
        }
        .scb-button--split span:after {
          background: white;
          content: '';
          display: block;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          transform: translateX(-105%);
          transition: transform 150ms ease-out;
          width: 100%;
          z-index: -1;
        }
        .scb-button--split .one:after {
          transition-delay: 300ms;
        }
        .scb-button--split .two:after {
          transition-delay: 150ms;
        }
        .scb-button--split .three:after {
          transition-delay: 0ms;
        }
        .scb-button--split:hover .one:after {
          transition-delay: 0ms;
        }
        .scb-button--split:hover .two:after {
          transition-delay: 150ms;
        }
        .scb-button--split:hover .three:after {
          transition-delay: 300ms;
        }
        .scb-button--split:hover span:after {
          transform: translateX(0%);
        }`,
        component: function component() {
          return <button className='scb-button--split max-width' type="button">
            <span className="one">One&nbsp;</span>
            <span className="two">Two&nbsp;</span>
            <span className="three">Three&nbsp;</span>
          </button>;
        }
      },
      {
        type: 'Markdown',
        content: `Since the ease is applied on a per-element basis, the momentum of the animation is lost.
This finally brings me to splitting bezier curves: we want to find a \`transition-timing-function\` to be applied to each element. 

First thing first, let's swap the ease-out with its cubic bezier curve equivalent: \`cubic-bezier(0,0,.58,1)\`, and let's keep each span to be exactly the same length:`
      },
      {
        type: 'FunctionalComponent',
        css: `.cb-easing span:after {
          transition-timing-function: cubic-bezier(0,0,.58,1);
        }`,
        component: function component() {
          return <button className='scb-button--split max-width cb-easing' type="button">
            <span className="one">Word&nbsp;</span>
            <span className="two">Word&nbsp;</span>
            <span className="three">Word&nbsp;</span>
          </button>;
        }
      },
      {
        type: 'Markdown',
        content: `Given the animation of three words, let's split the function into three distinct functions. 
See below for a visual representation of the \`ease-out\` function, where we can see y over time.
`
      },
      {
        type: 'FunctionalComponent',
        css: `svg.cb-svg {
          display: block;
          height: 100px;
          margin: 0 auto;
          position: relative;
          width: 100px;
        }
        
        .cb-svg path {
          fill: none;
          stroke-width: 5;
        }`,
        component: function component() {

          const points = [[0, 500], [0, 500], [290, 0], [500, 0]];

          const splitted = [...Array(3)].reduce((acc, _, i) => {
            return acc.concat([
              points.map((pt, ii) => {
                if(ii === 0 && i === 0) return pt;
                return [pt[0]/3, pt[1]/3]
              })
            ]);
          }, []);

          // console.log(splitted)

          return <svg viewBox="-5 -5 505 505" className="cb-svg">
            <path d="M0,500 C0,500 290,0 500,0" stroke="black" style={{strokeWidth: 10}} />
            {/*{splitted.map(pts => <path d={`M${pts[0][0]},${pts[0][1]} C${pts[1][0]},${pts[1][1]} ${pts[2][0]},${pts[2][1]} ${pts[3][0]},${pts[3][1]}`} stroke="red" />)}*/}
          </svg>;
        }
      },
      {
        type: 'Markdown',
        content: `... I'll write the rest on my flight to Bali :)`
      },
    ]
  },
  'transitionable-react-router': {
    link: 'transitionable-react-router',
    title: `React Transitionable Route`,
    date: `October 2019`,
    categories: 'web',
    content: [
      {
        type: 'Markdown',
        content: `With both Reach Router and react-transition-group this simple blog had a bit too much JavaScript, so decided to build my own react router, with transitionable routes.`
      },
      {
        type: 'Markdown',
        content:`Admittedly, there's a lot more I could have done to minimise the weight of this blog, and improve render time – such as not using a framework, using a smaller framework (preact) and so on.
        For the time being, I thought I'd write a router with hooks, enable SSR, and add some sort of transitioning logic to it.`
      },
      {
        type: 'Markdown',
        content:`For lack of better name I've named it [@stilva/transitionable-react-router](https://www.github.com/stilva/transitionable-react-router).

My website runs with this router, so check out how I've put it together here [@stilva/stilva.com](https://www.github.com/stilva/stilva.com).
`
      },
      {
        type: 'Markdown',
        content:`I've built it with hooks and somewhat followed react-transition-group's latest API. I really like their v1 API which allowed the components to dictate when a transition is done, as opposed to hard-coding a timeout for all transitions.
For routes, however, I wasn't convinced this feature was needed, so I opted for the components to receive a transition state prop.`
      },
      {
        type: 'Markdown',
        content:`I believe all the unit tests can serve as a great documentation, so I'd check these out [TransitionableReactRoute.test.js](https://github.com/stilva/transitionable-react-router/blob/master/src/TransitionableReactRoute.test.js).

For now, here's a brief overview of how to use \`TransitionableReactRoute\`:

\`\`\`jsx
&lt;TransitionableReactRoute
  timeout={850}
  animateOnMount={true}
&gt;
  &lt;LabList path="/lab" /&gt;
  &lt;LabEntry path="/lab/:labId" /&gt;
  &lt;Home defaultpath /&gt;
&lt;/TransitionableReactRoute&gt;
\`\`\`

Each path is transformed into a regular expression that is then matched against the URL. Consequently, path matching is eager, so the order in which your components are declared matters.
`
      },
      {
        type: 'Markdown',
        content:`Like with all your React components, you can nest your \`TransitionableReactRoute\` components.

\`\`\`jsx
&lt;TransitionableReactRoute
  timeout={850}
  animateOnMount={true}
&gt;
  &lt;TransitionableReactRoute path="/nested" &gt;
    &lt;One path="one" /&gt;  {{// will match /nested/one }}
  &lt;/TransitionableReactRoute&gt;
&lt;/TransitionableReactRoute&gt;
\`\`\`

`
      },
      {
        type: 'Markdown',
        content:`One of the few missing pieces with React-Transitionable-Router – apart from a better name – is a sort of Link component. For the time being, I'm just using the context as below:

\`\`\`jsx
import {useContext} from "react";
import {RouterContext} from "@stilva/transitionable-react-router";

export function Link({label, path}) {
  const {setRouter} = useContext(RouterContext);
  return &lt;a href="path" onClick={e => setRouter(path)}&gt;
    {label}
  &lt;/a&gt;;
}

\`\`\`

`
      },
    ]
  },

  'markdown': {
    title: `Markdown`,
    date: `January 2019`,
    categories: 'web',
    content: [
      {
        type: 'Markdown',
        content: `In adding entries to this lab, my list of custom component started growing. Instead of writing custom components, I thought I'd build a small markdown component, so I could write my articles in markdown, and publish them.

It's on github: [@stilva/markdown](https://www.github.com/stilva/markdown), check it out.

I haven't gotten around writing any documentation, but the test within the \`./src\` folder can serve as documentation.`
      },
      {
        type: 'Markdown',
        content: `There's a few performance tests I'd like to run:
* What are the performance implications in creating DOM elements vs building string representations and using \`dangerouslySetInnerHTML\`
* Same for using createElement as a building block (I'm not convinced there's much to gain by converting the input as actual react components, given the static nature of markdowns)
* Avoiding regexp, and having a more abstract representation of the markdown. e.g. new Node(), new Leaf()

I initially had decided to use RegExp to keep the code simple, and to worry about performance when needed.
The only performance optimisation I have done this far, is to cache the rendered HTML string in the SessionStorage.
At the moment the only way to invalidate it is by passing a new key.`
      },
    ]
  },

  'glsl': {
    link: 'glsl',
    title: `GLSL`,
    date: `September 2018`,
    categories: 'web',
    content: [
      {
        type: 'Markdown',
        content: `Writing fragment shaders is a lot of fun. Setting up everything to easily write a shader is much less so.

Having had to go through the whole process on more than one occasion in the last few months, I've decided to finally write a small library to ease the pain.
This is based on code from back in 2016, and I've updated it to use the template literals so it looks nicer. 
It's on github: [@stilva/glsl](https://www.github.com/stilva/glsl), check it out.`
      },
      {
        type: 'Markdown',
        content: `The following is a quick basic shader sample:`
      },
      {
        type: 'CanvasComponent',
        componentDidMount: function (node) {
          const GLSL = require('@stilva/glsl');

          const glsl = new GLSL(node);
          glsl.addVariable('u_delta', [0, 2, 4]);

          glsl.fragment`void main() {
				vec2 uv = gl_FragCoord.xy/u_resolution.xy;
				vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + u_delta);
				gl_FragColor = vec4(col, 1.0);
			}`;

          glsl.render();
        }
      },
      {
        type: 'Markdown',
        content:
          `This library allows for you to focus on just the shader – a very basic shadertoy, if you may.

The clearing of the buffer in the rendering loop, setting the vertex shader, uniform locations etc are all taken care of for you.

The sample above was written with the following:

\`\`\`javascript
const GLSL = require('@stilva/glsl');

const glsl = new GLSL(node);
glsl.addVariable('u_delta', [0, 2, 4]);

glsl.fragment\`void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + u_delta);
  gl_FragColor = vec4(col, 1.0);
}\`;
glsl.render();\`\`\`

Note how some uniforms are provided for you by default, while you're easily able to add your own, by calling \`glsl.addVariable()\``
      },
      {
        type: 'Markdown',
        content: `Still very much a WIP, and here's my to-do list:
* Add tests, maybe jest + puppeteer, or just jest + Karma runner.
* Add a resize function, based on the canvas size.
* Add the texel read/write option once I figure out the best API for it.`
      }
    ]
  }
};
