import React, {memo, useEffect, useRef} from 'react';
import GLSL from '@stilva/glsl';

import Code from '../../components/Code';

export default memo(function() {
  return <>
    <h1 className="work-name">React Transitionable Route</h1>
    <div className="blob">
      <p>
        With both Reach Router and react-transition-group this simple blog had a bit too much JavaScript, so decided to
        build my own react router, with transitionable routes.
      </p>
      <p>
        Admittedly, there's a lot more I could have done to minimise the weight of this blog, and improve render time –
        such as not using a framework, using a smaller framework (preact) and so on.
        For the time being, I thought I'd write a router with hooks, enable SSR, and add some sort of transitioning
        logic to it.
      </p>
      <p>
        For lack of better name I've named it <a
        href="https://www.github.com/stilva/transitionable-react-router">@stilva/transitionable-react-router</a>.
      </p>
      <p>
        My website runs with this router, so check out how I've put it together here <a
        href="https://www.github.com/stilva/stilva.com">@stilva/stilva.com</a>.
      </p>
      <p>
        I've built it with hooks and somewhat followed react-transition-group's latest API. I really like their v1 API
        which allowed the components to dictate when a transition is done, as opposed to hard-coding a timeout for all
        transitions.
        For routes, however, I wasn't convinced this feature was needed, so I opted for the components to receive a
        transition state prop.
      </p>
      <p>
        I believe all the unit tests can serve as a great documentation, so I'd check these out <a
        href="https://github.com/stilva/transitionable-react-router/blob/master/src/TransitionableReactRoute.test.js">TransitionableReactRoute.test.js</a>.
      </p>
      <p>
        For now, here's a brief overview of how to use <code>TransitionableReactRoute</code>:
      </p>
      <Code lan="jsx">
        {
          `<TransitionableReactRoute
  timeout={850}
  animateOnMount={true}
>
  <LabList path="/lab" />
  <LabEntry path="/lab/:labId" />
  <Home defaultpath />
</TransitionableReactRoute>`
        }
      </Code>
      <p>
        Each path is transformed into a regular expression that is then matched against the URL. Consequently, path
        matching is eager, so the order in which your components are declared matters.
      </p>
      <p>
        Like with all your React components, you can nest your <code>TransitionableReactRoute</code> components.
      </p>
      <Code lan="jsx">
        {`<TransitionableReactRoute
  timeout={850}
  animateOnMount={true}
>
  <TransitionableReactRoute path="/nested" >
    <One path="one" />  {{// will match /nested/one }}
  </TransitionableReactRoute>
</TransitionableReactRoute>`}
      </Code>
      <p>
        One of the few missing pieces with React-Transitionable-Router – apart from a better name – is a sort of Link
        component. For the time being, I'm just using the context as below:
      </p>
      <Code lan="jsx">
        {`import {useContext} from "react";
import {RouterContext} from "@stilva/transitionable-react-router";

export function Link({label, path}) {
  const {setRouter} = useContext(RouterContext);
  return <a href="path" onClick={e => setRouter(path)}>
    {label}
  </a>;
}`}
      </Code>
    </div>
  </>
});
