export default {
  'glsl-ui-animation': require('./labs/glsl-ui-animation/index').default,
  'spring-animation': require('./labs/springAnimation').default,
  'splitting-cubic-bezier': require('./labs/splittingCubicBezier').default,
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
&lt;/TransitionableReactRoute&gt;\`\`\`

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
}\`\`\`
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
