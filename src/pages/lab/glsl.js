import React, {memo} from 'react';

export default memo(function Home() {
  return <>
    <h1 className="work-name">GLSL</h1>
    <div className="blob">
      <p>
        Writing fragment shaders is a lot of fun. Setting up everything to easily write a shader is much less so.
      </p>
      <p>
        Having had to go through the whole process on more than one occasion in the last few months, I've decided to finally write a small library to ease the pain. This is based on code from back in 2016, and I've updated it to use the template literals so it looks nicer. It's on github: @stilva/glsl, check it out.
      </p>
      <p>
        The following is a quick basic shader sample:
      </p>
    </div>
  </>
});
