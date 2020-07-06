import React, {memo} from 'react';

import {Code} from '../../components';

export default memo(function () {
  return <>
    <h1>Refactoring the folio</h1>
    <p>
      This folio and lab are meant to be my continuous experiment so I can test out new "architectures", new styles, new
      libraries etc. – at least this is my excuse for having gone through, and refactored everything.
    </p>
    <p>
      Back in 2018, when I first thought of updating my folio, with a lab section – where I'd finally keep track of all
      my never ending side-projects – I thought I'd kill two birds with one stone by writing a custom markdown parser
      (and then writing an entry for it), and build my folio and deployment pipelines around it.
    </p>
    <p>
      While it has been a lot of fun and it has worked thus far, the pipeline was getting in my way of quickly deploying
      new lab entries with custom components.
    </p>
    <p>
      So, naturally, I thought I'd go back to the basics with less abstraction and a new stack: plain react components,
      with CSS-in-JS (linaria).
    </p>
    <p>
      I like my css in css files (or scss files). Unfortunately we're using emotionjs with styled components at work and
      from force of habit, I decided to also use a CSS-in-JS.
    </p>
    <p>
      However, I did want to avoid using emotionjs as it comes with a runtime. Instead, I've opted for linaria which is
      a run-time free CSS-in-JS library. I've also opted to avoid using styled-components, as I like the composability
      of CSS class better.
    </p>
    <p>
      Another added benefit of going back to basics is the control that I regained from removing the markdown
      abstraction. I'm now able to optimise how components and pages are loaded, split more bundles etc – Yes, I could
      have just used gatsby / next.js, but where's the fun of it?
    </p>
    <p>
      I used <code>loadable-components</code> to do route-based component splitting (see below). The lighthouse score
      did not change much, but without code splitting lighthouse score would have eventually seen a dip from bundle.js
      getting too large.
    </p>
    <Code lan="jsx">
      {`
import React, {memo} from 'react';
import loadable from '@loadable/component'

import BasePage from "./BasePage";

const Lazy = loadable(({slug}) => import(\`./lab/$\{slug}\`));

export default memo(function Lab({labId}) {
  return <BasePage>
    <Lazy slug={labId} />
  </BasePage>;
});
      `}
    </Code>
    <h2>What's left to do:</h2>
    <ul>
      <li>
        Figure out an API for a React element query library. Media queries are great, but the more complex or custom you
        want your design language, the more you hit its limits. Definitely one of the many reasons to be excited about
        Houdini (the low level CSS APIs)
      </li>
      <li>
        Optimising the build & crawl process: I'm currently re-building everything (bundle and chunks) each time I push
        changes. I'm hoping some improved build caching with webpack 5 would solve some of these issues. Otherwise,
        writing some custom code and relying on git to know which entry has changed could be an option?
      </li>
      <li>
        I'm trying to stay focused on one of the many side projects I have going on. Currently battling the thought of
        writing my own react / vdom – I know it's silly, just very tempting.
      </li>
      <li>
        Also had to refrain myself from diving into <code>@loadable/babel-plugin</code> too much. I wanted to assign a
        custom directory to each dynamically loaded component. (I've opted for <code>./dist/partials</code> as the
        directory for everything, for now)
      </li>
    </ul>
  </>
});
