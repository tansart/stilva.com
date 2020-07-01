import React, {memo, useEffect, useRef} from 'react';

export default memo(function() {
  return <>
    <h1 className="work-name">Markdown</h1>
    <div className="blob">
      <p>
        In adding entries to this lab, my list of custom component started growing. Instead of writing custom
        components, I thought I'd build a small markdown component, so I could write my articles in markdown, and
        publish them.
      </p>
      <p>
        It's on github: <a href="https://www.github.com/stilva/markdown">@stilva/markdown</a>, check it out.
      </p>
      <p>
        I haven't gotten around writing any documentation, but the test within the <code>./src</code> folder can serve
        as documentation.
      </p>
      <p>
        There's a few performance tests I'd like to run:
      </p>
      <ul>
        <li>
          What are the performance implications in creating DOM elements vs building string representations and
          using <code>dangerouslySetInnerHTML</code>
        </li>
        <li>
          Same for using createElement as a building block (I'm not convinced there's much to gain by converting the
          input as actual react components, given the static nature of markdowns)
        </li>
        <li>
          Avoiding regexp, and having a more abstract representation of the markdown. e.g. new Node(), new Leaf()
        </li>
      </ul>
      <p>
        I initially had decided to use RegExp to keep the code simple, and to worry about performance when needed.
        The only performance optimisation I have done this far, is to cache the rendered HTML string in the
        SessionStorage.
        At the moment the only way to invalidate it is by passing a new key.
      </p>
    </div>
  </>
});
