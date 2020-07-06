import React, {memo, useEffect, useRef} from 'react';
import GLSL from '@stilva/glsl';

import {Code} from '../../components';

export default memo(function () {
  return <>
    <h1>GLSL</h1>
    <p>
      Writing fragment shaders is a lot of fun. Setting up everything to easily write a shader is much less so.
    </p>
    <p>
      Having had to go through the whole process on more than one occasion in the last few months, I've decided to
      finally write a small library to ease the pain. This is based on code from back in 2016, and I've updated it to
      use the template literals so it looks nicer. It's on github: @stilva/glsl, check it out.
    </p>
    <p>
      The following is a quick basic shader sample:
    </p>
    <Canvas/>
    <p>
      This library allows for you to focus on just the shader – a very basic shadertoy, if you may.
    </p>
    <p>
      The clearing of the buffer in the rendering loop, setting the vertex shader, uniform locations etc are all taken
      care of for you.
    </p>
    <p>
      The sample above was written with the following:
    </p>
    <Code lan="javascript">
      {`
const glsl = new GLSL(node.current);
glsl.addVariable('u_delta', [0, 2, 4]);

glsl.fragment\`void main() {
  vec2 uv = gl_FragCoord.xy/u_resolution.xy;
  vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + u_delta);
  gl_FragColor = vec4(col, 1.0);
}\`;

glsl.render();
      `}
    </Code>
    <p>
      Note how some uniforms are provided for you by default, while you're easily able to add your own, by
      calling <code>glsl.addVariable()</code>
    </p>
    <p>
      Still very much a WIP, and here's my to-do list:
    </p>
    <ul>
      <li>Add tests, maybe jest + puppeteer, or just jest + Karma runner.</li>
      <li>Add a resize function, based on the canvas size.</li>
      <li>Add the texel read/write option once I figure out the best API for it.</li>
    </ul>
  </>
});

function Canvas({}) {
  const node = useRef();

  useEffect(() => {
    const glsl = new GLSL(node.current);
    glsl.addVariable('u_delta', [0, 2, 4]);

    glsl.fragment`void main() {
      vec2 uv = gl_FragCoord.xy/u_resolution.xy;
      vec3 col = 0.5 + 0.5 * cos(u_time + uv.xyx + u_delta);
      gl_FragColor = vec4(col, 1.0);
    }`;

    glsl.render();
  }, [])

  return <canvas
    ref={node}
    width={400}
    height={400}
  />;
}
