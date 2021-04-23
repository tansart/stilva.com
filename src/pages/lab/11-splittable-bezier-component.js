import React, {memo, useMemo} from 'react';
import Code from '../../components/Code'
import {css} from 'linaria';

export default memo(function () {
  return <>
    <h1>Splittable Bézier component</h1>
    <h2>Overview</h2>
    <p>Thought I'd create a React component based on my research on <a
      href="/lab/splitting-cubic-bezier">how to split a Bézier curve into smaller Bézier curves</a>.
      However, instead of documenting the component after building it, I thought I'd scribble down my thought processes
      as I go.
    </p>

    <h2>API</h2>
    <p>The goal is to have a component, with a lean API, where we could pass the desired cubic bezier curve, the class
      name or style as a prop, the text to display, the animation speed.</p>
    <p>My first thoughts were to use a render-prop API as below:</p>
    <Code lan="jsx">
      {`
<BezierAnimated bezier={[0, 0, 0.58, 1]} speed={100}>
    {(easing, duration) => (<div style={{..., transitionDuration: duration, transitionTimingFunction: easing}}>
        I'm the text, hello!
    </div>)}
</BezierAnimated>
      `}
    </Code>
    <p>Unfortunately <code>{`<BezierAnimated />`}</code> wouldn't let you split and apply styles per text block. This
      also defeats the purpose of a render prop – where you want to let the user customise how to use the render prop
      function's arguments.</p>
    <Code lan="jsx">
      {`
<BezierAnimated bezier={[0, 0, 0.58, 1]} speed={100}>
    I'm the text, hello!
</BezierAnimated>
      `}
    </Code>
    <p>The question then becomes how to expose the right amount of animatable props. Could this component work both with
    CSS animation and transitions?</p>
    <p>I'll stick to CSS transitions for now. Let's also add a <code>reverseOnHover</code> prop,
      so we can easily make buttons with hover animations.
    </p>
    <Code lan="jsx">
      {`
function MyComponent() {
  const mTransition = useMemo(() => {
      return new Transition()
        .reverseOnHover()
        .time(100)
        .setBezier(0, 0, 0.58, 1)
        .addProperty('opacity');
  }, []);
  
  return <BezierAnimated transition={mTransition}>
      I'm the text, hello!
  </BezierAnimated>
}
      `}
    </Code>
    <p>I like the <code>Transition</code> class, possibly because it reminds me of TweenMax/Lite.</p>
    <p>Let's focus on the <code>Transition</code> class' API. What if we wanted to have more granular control per property?
      We could allow <code>.addProperty</code> to accept <code>time</code> as a second parameter? However, we'd then want to also
      allow it to accept a new bézier curve? What if we created a <code>new Property()</code> class and allow them to be combined?
      I feel like it'd get too messy, and too verbose quickly. Instead, let's just allow for <code>BezierAnimated</code> to accept an array of transition:
    </p>
    <Code lan="jsx">
      {`
<BezierAnimated.div transitions={[scalingTransition, opacityTransition]}>
    I'm the text, hello!
</BezierAnimated.div>
      `}
    </Code>
    <SampleBezierAnimated />
  </>
});

const BezierAnimatedInstances = {};
const BezierAnimated = new Proxy(BezierAnimatedBase, {
  get(obj, type) {
    return BezierAnimatedInstances[type] || (BezierAnimatedInstances[type] = React.forwardRef(({children, ...props}, ref) => (
      <BezierAnimatedBase type={type} {...props}>
        {children}
      </BezierAnimatedBase>
    )));
  }
});

function BezierAnimatedBase({children, transition, transitions, type, ...props}) {
  const splitChildren = children.split(' ').map((w, i) => <span key={`span_${i}`}>{w} </span>);
  return React.createElement(type, {...props}, splitChildren)
}

class Transition {
  constructor() {
  }

  addProperty() {
    return this;
  }

  reverseOnHover() {
    return this;
  }

  setBezier() {
    return this;
  }

  time() {
    return this;
  }
}

const wrapperCSS = css`
  background: rgba(0, 0, 0, .25);
  display: inline-block;
  padding: 4px;
`;

function SampleBezierAnimated() {
  const mTransition = useMemo(() => {
    return new Transition()
      .reverseOnHover()
      .time(100)
      .setBezier(0, 0, 0.58, 1)
      .addProperty('opacity');
  }, []);

  return <BezierAnimated.div className={wrapperCSS} transition={mTransition}>
    I'm the text, hello!
  </BezierAnimated.div>;
}
