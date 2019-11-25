import React from 'react';

export default {
  link: 'splitting-cubic-bezier',
  title: `Splitting a cubic Bézier curve`,
  date: `November 2019`,
  categories: 'web',
  content: [
    {
      type: 'Markdown',
      content: `In this post, I thought I'd go over splitting Bézier curves into an arbitrary number of smaller Bézier curves.
Before diving into the nitty gritty, let's take a step back for a little context:

Let's write a very simple button component where we have a background animation.`
    },
    {
      type: 'FunctionalComponent',
      css: `svg.cb-svg {
          display: block;
          height: 200px;
          margin: 0 auto;
          position: relative;
          width: 200px;
        }

        .cb-svg path {
          fill: none;
          stroke-width: 5;
        }

        .cb-svg  {
          fill: none;
          stroke-width: 5;
        }
        
        .scb-button {
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
      content: `The first CSS property that came to mind was \`box-decoration-break: clone;\`. Unfortunately I needed the display element to be a \`block\`, or an \`inline-block\`.
So this wouldn't work.

The next step was to split the button in smaller components and to apply multiple \`transition-delay\` to its sub-elements to stagger the animations.
It's also worth noting that the \`transition-delay\` needs to be applied inversely to \`element:hover {}\` so the first element animates last when you hover out.`
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
        .scb-button--split span:after,
        .with-before.scb-button--split span:before {
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
          z-index: -2;
        }
        .scb-button--split .one:after,
        .scb-button--split:hover .three:after {
          transition-delay: 300ms;
        }
        .scb-button--split .two:after,
        .scb-button--split:hover .two:after {
          transition-delay: 150ms;
        }
        .scb-button--split .three:after,
        .scb-button--split:hover .one:after {
          transition-delay: 0ms;
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
      content: `As you can see, because the ease is applied on a per-element basis, the momentum of the animation is lost.

This brings me to the topic at hand: splitting Bézier curves. We want to find a \`transition-timing-function\` to be applied to each element, such that the overall animation respects the easing. 

Below, we have a quadratic Bézier curve: two points where the line starts/end and two control points that dictates the curvature of the curve.`
    },
    {
      type: 'FunctionalComponent',
      css: `.bc-text {
        font-size: 36px;
        fill: black;
      }`,
      component: function() {
        const points = [[0, 0], [0, 250], [290, 500], [500, 0]];

        return <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
          {drawBezier(points)}
          {drawCurve(points[0], points[1], points[2], points[3])}
        </svg>
      }
    },
    {
      type: 'Markdown',
      content: `And here's the quadratic Bézier curve function that returns the point of the curve at \`t\` (where \`t ∈ {0, 1}\`) given the four points \`p0, p1, p2, p3\`:

\`\`\`javascript
function CubicBezierCurve(t, p0, p1, p2, p3) { 
  return (1 - t)³ * p0 + 3 * (1 - t)² * t * p1 + 3 * (1 - t) * t² * p2 + t³ * p3
}\`\`\`

There is a simple recursive geometric algorithm that allows you to split a curve in two distinct Bézier curves at any given \`t\`:
`
    },
    {
      type: 'FunctionalComponent',
      component: function() {
        const sample = 10;
        const [t, setT] = React.useState(1);
        const points = [[0, 0], [0, 250], [290, 500], [500, 0]];

        useAlternateSetState((config) => {
          setT(n => {
            config.direction = n >= 10 ? -1: (n <= 1 ? 1: config.direction);
            return (n + config.direction);
          });
        });

        const first_pass = calculateSubs(t/sample, points);
        const second_pass = calculateSubs(t/sample, first_pass);
        const third_pass = calculateSubs(t/sample, second_pass);

        function CubicBezierCurve(t, p0, p1, p2, p3) {
          return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3
        }

        return <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
          <line x1={points[1][0]} y1={500 - points[1][1]} x2={points[2][0]} y2={500 - points[2][1]} stroke="black" strokeDasharray="20"/>
          {drawBezier(points)}
          <line x1={first_pass[0][0]} y1={500 - first_pass[0][1]} x2={first_pass[1][0]} y2={500 - first_pass[1][1]} stroke="blue" strokeDasharray="20"/>
          <line x1={first_pass[1][0]} y1={500 - first_pass[1][1]} x2={first_pass[2][0]} y2={500 - first_pass[2][1]} stroke="blue" strokeDasharray="20"/>
          <line x1={second_pass[0][0]} y1={500 - second_pass[0][1]} x2={second_pass[1][0]} y2={500 - second_pass[1][1]} stroke="red" strokeDasharray="20"/>

          <line x1={t/sample * 500} y1={0} x2={t/sample * 500} y2={500} stroke="red" strokeDasharray="20"/>

          {first_pass.map(pt => <circle cx={pt[0]} cy={500 - pt[1]} r="15" fill="blue" stroke="none" />)}
          {second_pass.map(pt => <circle cx={pt[0]} cy={500 - pt[1]} r="15" fill="red" stroke="none" />)}
          {drawCurve(points[0], points[1], points[2], points[3])}
          {third_pass.map(pt => <circle cx={pt[0]} cy={500 - pt[1]} r="15" fill="cyan" stroke="none" />)}
        </svg>
      }
    },
    {
      type: 'Markdown',
      content: `Unfortunately, as you can see from the animation above, \`t\` doesn't have a direct correlation with the horizontal "time" axis.

The best solution I've found so far is to sample the curve and get an approximate mapping of time to \`t\`.`
    },
    {
      type: 'FunctionalComponent',
      component: function() {
        const [sample, setSample] = React.useState(10);
        const points = [[0, 0], [0, 250], [290, 500], [500, 0]];

        useAlternateSetState((config) => {
          setSample(n => {
            config.direction = n > 10 ? -1: (n <= 2 ? 1: config.direction);
            return (n + config.direction);
          });
        });

        return <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
          {drawCurve(points[0], points[1], points[2], points[3])}
          <path d={Array.from(Array(sample + 1), (_, i) => {
            const p = CubicBezierCurve(i/sample, points);
            return i === 0 ? `M${p[0]} ${500 - p[1]}`: ` L${p[0]} ${500 - p[1]}`;
          })}
          stroke="red" />
        </svg>
      }
    },
    {
      type: 'Markdown',
      content: `Once we have an approximate mapping of time to \`t\`, we can run the geometric algorithm mentioned above and split a Bézier curve in multiple smaller Bézier curves.`
    },
    {
      type: 'FunctionalComponent',
      component: function() {
        const [sample, setSample] = React.useState(100);
        const targetTs = [1/4 * 500, 2/4 * 500, 3/4 * 500];
        const originalPoints = [[0, 0], [0, 250], [290, 500], [500, 0]];
        const c = splitBC(targetTs, originalPoints, sample);
        const COLORS = ['blue', 'white', 'red', 'pink'];

        useAlternateSetState((config) => {
          setSample(n => {
            config.direction = n >= 200 ? -1: (n <= 25 ? 1: config.direction);
            return (n + config.direction * 25);
          });
        });

        return <div className="markdown">
          <p>
            With a sample rate of {sample}, we get the following four distinct bezier curves:<br />
            <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
              {c.map((pts, i) => drawCurve(pts[0], pts[1], pts[2], pts[3], COLORS[i]))}

              {targetTs.map(x => <line x1={x} y1={0} x2={x} y2={500} stroke="green" strokeWidth={1} />)}
            </svg>
          </p>
        </div>
      }
    },
    {
      type: 'Markdown',
      content: `We now know how to split a Bézier curve into multiple smaller Bézier curves. While these steps were necessary will be used below, this isn't the end-goal we were looking for.

In fact, what we need is to split the bezier curve such that the distance (y-axis) is spilt to match our \`<span />\` elements, then find their respective \`t\`s`
    },
    /*{
      type: 'FunctionalComponent',
      css: `.with-before.scb-button--split span:before {
          transition-timing-function: inherit;
      }
      .with-before {
        padding: 0;
      }
      .with-before span {
        z-index: 1;
      }
      .with-before:before,
      .with-before:after {
          background: black;
          content: '';
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: -2;
      }
      .with-before:after {
          background: green;
          transform: translateX(-105%);
          transition: transform 4500ms ease-out;
          z-index: -1;
      }
      .with-before:hover:after {
        transform: translateX(0%);
      }
      .with-before.scb-button--split span:before,
      .with-before.scb-button--split span:after {
        transition-duration: 1500ms;
      }
      .with-before.scb-button--split span:after {
        bottom: 0px;
        height: 6px;
        top: auto;
      }
      .with-before.scb-button--split span:before {
        background: red;
        height: 6px;
        z-index: -1;
      }
      .with-before.scb-button--split .one:after,
      .with-before.scb-button--split:hover .three:after,
      .with-before.scb-button--split .one:before,
      .with-before.scb-button--split:hover .three:before {
        transition-delay: 3s;
      }
      .with-before.scb-button--split .two:after,
      .with-before.scb-button--split:hover .two:after,
      .with-before.scb-button--split .two:before,
      .with-before.scb-button--split:hover .two:before {
        transition-delay: 1500ms;
      }
      .with-before.scb-button--split .three:after,
      .with-before.scb-button--split:hover .one:after,
      .with-before.scb-button--split .three:before,
      .with-before.scb-button--split:hover .one:before {
        transition-delay: 0ms;
      }
      .with-before.scb-button--split:hover span:after,
      .with-before.scb-button--split:hover span:before {
        transform: translateX(0%);
      }
      `,
      component: function component() {
        const originalPoints = [[0, 0], [0, 0], [.58, 1], [1, 1]];
        const targetTs = [1/3, 2/3];
        const c = splitBC(targetTs, originalPoints, 20);

        function getBezier(c) {
          return `cubic-bezier(${c[1].join(',')}, ${c[2].join(',')})`;
        }

        console.info(c);

        return <button className='scb-button--split cb-easing with-before' type="button">
          <span className="one" style={{transitionTimingFunction: getBezier(c[0])}}>Word&nbsp;</span>
          <span className="two" style={{transitionTimingFunction: getBezier(c[1])}}>Word&nbsp;</span>
          <span className="three" style={{transitionTimingFunction: getBezier(c[2])}}>Word&nbsp;</span>
        </button>;
      }
    }*/
  ]
};

function CubicBezierCurve(t, [p0, p1, p2, p3]) {
  return [
    Math.pow(1 - t, 3) * p0[0] + 3 * Math.pow(1 - t, 2) * t * p1[0] + 3 * (1 - t) * Math.pow(t, 2) * p2[0] + Math.pow(t, 3) * p3[0],
    Math.pow(1 - t, 3) * p0[1] + 3 * Math.pow(1 - t, 2) * t * p1[1] + 3 * (1 - t) * Math.pow(t, 2) * p2[1] + Math.pow(t, 3) * p3[1]
  ];
}

function calculateSubs(t, points) {
  const nPoints = [];
  for(let i = 1; i < points.length; i++) {
    nPoints.push([
      points[i - 1][0] + (points[i][0] - points[i - 1][0]) * t,
      points[i - 1][1] + (points[i][1] - points[i - 1][1]) * t
    ])
  }
  return nPoints;
}

function drawCurve(p0, p1, p2, p3, stroke='black') {
  return <path d={`M${p0[0]},${500 - p0[1]} C${p1[0]},${500 - p1[1]} ${p2[0]},${500 - p2[1]} ${p3[0]},${500 - p3[1]}`} stroke={stroke} style={{strokeWidth: 1}} />
}

function drawBezier([p0, p1, p2, p3]) {
  return <React.Fragment>
    <circle cx={p0[0]} cy={500 - p0[1]} r="25" fill="black" stroke="none" />
    <circle cx={p3[0]} cy={500 - p3[1]} r="25" fill="black" stroke="none" />
    <line x1={p0[0]} y1={500 - p0[1]} x2={p1[0]} y2={500 - p1[1]} stroke="black" strokeDasharray="20"/>
    <line x1={p2[0]} y1={500 - p2[1]} x2={p3[0]} y2={500 - p3[1]} stroke="black" strokeDasharray="20"/>
    <circle cx={p1[0]} cy={500 - p1[1]} r="25" fill="#feb2a8" stroke="none" />
    <circle cx={p2[0]} cy={500 - p2[1]} r="25" fill="#feb2a8" stroke="none" />
  </React.Fragment>
}

function splitBC(targetTs, originalPoints, sample = 20) {
  let points = null;
  let _sample = sample;
  const combinedBC = [];
  for(let i = 0; i < targetTs.length; i++) {
    let diff = -1;

    if(i === 0) {
      points = originalPoints.slice(0);
    } else {
      // we reduce the sample size.
      _sample -= sample/targetTs.length | 0;
    }

    for(let ii = 0; ii <= _sample; ii++) {
      const x = CubicBezierCurve(ii/_sample, points)[0];
      if(diff === -1) {
        diff = Math.abs(targetTs[i] - x);
      } else {
        const newDiff = Math.abs(targetTs[i] - x);
        if(newDiff < diff) {
          diff = newDiff;
        } else {
          const splitBC = splitCurveAt((ii - 1)/_sample, points);
          points = splitBC[1];
          combinedBC.push(splitBC[0]);

          if(i + 1 === targetTs.length) {
            combinedBC.push(splitBC[1]);
          }
          break;
        }
      }
    }
  }
  return combinedBC;
}

function splitCurveAt(r, points) {
  const first_pass = calculateSubs(r, points);
  const second_pass = calculateSubs(r, first_pass);
  const third_pass = calculateSubs(r, second_pass);

  return [
    [points[0], first_pass[0], second_pass[0], third_pass[0]],
    [third_pass[0], second_pass[1], first_pass[2], points[3]]
  ]
}

function useMouseXPosition(domRef, defaultValue) {
  const [r, setR] = React.useState(defaultValue);
  React.useEffect(() => {
    domRef.current.addEventListener('mousemove', e => {
      setR(Math.min(1, Math.max(0, 600/200 * e.layerX - 50)/500))
    });
  }, []);
  return r
}

function useAlternateSetState(setState) {
  React.useEffect(() => {
    const config = {
      direction: 1,
      isRunning: true
    };

    tick();

    function tick() {
      setState(config);
      config.isRunning && setTimeout(tick, 500);
    }
    return () => {
      config.isRunning = false;
    };
  }, []);
}
