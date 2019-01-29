export default [
  {
    type: 'Title',
    content: `Markdown / January 2019`
  },
  {
    type: 'Markdown',
    cacheid: 'markdown',
    content: `In adding entries to this lab, I realised I needed an inline link component. However, that would have complicated my JSON like data structure. Instead, I decided to build a small markdown component, so I could write my articles in markdown, and publish them.

It's on github: [@stilva/markdown](https://www.github.com/stilva/markdown), check it out.

There's a few performance tests I'd like to run:
* What are the performance implications in creating DOM elements vs building string representations and using \`dangerouslySetInnerHTML\`
* Same for using createElement as a building block (I'm not convinced there's much to gain by converting the input as actual react components, given the static nature of markdowns)
* Avoiding regexp, and having a more abstract representation of the markdown. e.g. new Node(), new Leaf()

I initially had decided to use RegExp to keep the code simple, and to worry about performance when needed.
The only performance optimisation I have done this far, is to cache the rendered HTML string in the SessionStorage.
At the moment the only way to invalidate it is by passing a new key.`
  },
  {
    type: 'Title',
    content: `GLSL / September 2018`
  },
  {
    type: 'Markdown',
    cacheid: 'glsl_intro',
    content: `Writing fragment shaders is a lot of fun. Setting up everything to easily write a shader is much less so.

Having had to go through the whole ceremony on more than one occasion in the last few months, I've decided to finally write a small library to ease the pain.
It's on github: [@stilva/glsl](https://www.github.com/stilva/glsl), check it out.`
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
    type: 'Paragraph',
    content: [
      `This library allows for a much more concise way of writing shaders.`,
      `The clearing of the buffer in the rendering loop, setting the vertex shader, uniform locations etc are all taken care of for you.`
    ]
  },
  {
    type: 'Code',
    content: `
const GLSL = require('@stilva/glsl');

const glsl = new GLSL(node);
glsl.addVariable('u_delta', [0, 2, 4]);

glsl.fragment\`void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + u_delta);
  gl_FragColor = vec4(col, 1.0);
}\`;

glsl.render();`
  },
  {
    type: 'Paragraph',
    content: [
      `Still very much a WIP, and here's my to-do list:`,
      `– Add tests, maybe jest + puppeteer, or just jest + Karma runner.`,
      `– Add a resize function, based on the canvas size.`,
      `– Add the texel read/write option once I figure out the best API for it.`,
    ]
  }
];
