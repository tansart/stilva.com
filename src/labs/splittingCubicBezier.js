import React from 'react';

export default {
  link: 'splitting-cubic-bezier',
  title: `Splitting a cubic Bézier curve`,
  date: `November 2019`,
  categories: 'web',
  content: [
    {
      type: 'FunctionalComponent',
      component: function() {
        const targetTs = [1/4 * 500, 2/4 * 500, 3/4 * 500];
        // 0.63,-0.57, 0.19, 1.51
        const originalPoints = [[0, 0], [0.63 * 500, -.5 * 500], [.19 * 500, 1.51 * 500], [500, 0]];
        const c = splitBCByT(targetTs, originalPoints);
        const COLORS = ['black', 'white', 'black', 'white'];

        console.log('c::', c);

        return <div className="markdown">
          <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
            {c.map((pts, i) => drawCurve(pts[0], pts[1], pts[2], pts[3], COLORS[i]))}

            {targetTs.map(x => <line x1={x} y1={0} x2={x} y2={500} stroke="#f8205d" strokeWidth={1} shapeRendering="crispEdges" />)}
          </svg>
        </div>
      }
    },
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

Unfortunately, things quickly get ugly when you need the button's animation to be split in two or more lines.`
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

The next step was to split the button's text into smaller elements and to apply multiple \`transition-delay\` to each, to stagger the animation.
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

Below is a visual representation of how the ease is currently applied (in red), versus how we'd want to have it applied (in blue).`
    },
    {
      type: 'FunctionalComponent',
      component: function () {
        const points = [[0, 0], [0, 0], [290, 500], [500, 500]];

        const pts0 = points.map(pts => [pts[0]/3, pts[1]/3]);
        const pts1 = points.map((pts, i) => [pts0[3][0] + pts[0]/3, pts0[3][1] + pts[1]/3]);
        const pts2 = points.map((pts, i) => [pts1[3][0] + pts[0]/3, pts1[3][1] + pts[1]/3]);

        return <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
          {drawCurve(pts0[0], pts0[1], pts0[2], pts0[3], '#f8205d')}
          {drawCurve(pts1[0], pts1[1], pts1[2], pts1[3], '#f8205d')}
          {drawCurve(pts2[0], pts2[1], pts2[2], pts2[3], '#f8205d')}

          <line x1={pts0[3][0]} y1={0} x2={pts0[3][0]} y2={500} stroke="black" strokeDasharray="10"/>
          <line x1={pts1[3][0]} y1={0} x2={pts1[3][0]} y2={500} stroke="black" strokeDasharray="10"/>

          <line x1={0} y1={500} x2={500} y2={500} stroke="black" strokeWidth="3px" shapeRendering="crispEdges" />
          <line x1={0} y1={500} x2={0} y2={0} stroke="black" strokeWidth="3px" shapeRendering="crispEdges" />

          {drawCurve(points[0], points[1], points[2], points[3], '#0a6bf2')}
        </svg>
      }
    },
    {
      type: 'Markdown',
      content: `This brings me to the topic at hand: splitting Bézier curves. We want to find a \`transition-timing-function\` to be applied to each element, such that the overall animation respects the easing. 

Below, we have a quadratic Bézier curve: two points where the line starts/end and two control points that dictates the curvature of the curve (control points).`
    },
    {
      type: 'FunctionalComponent',
      css: ``,
      component: function () {
        const points = [[0, 0], [0, 250], [290, 500], [500, 0]];

        return <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
          {drawBezier(points)}
          {drawCurve(points[0], points[1], points[2], points[3])}
        </svg>
      }
    },
    {
      type: 'Markdown',
      content: `Here's the quadratic Bézier curve function that returns the point of the curve at \`t\` (where \`t ∈ {0, 1}\`) given the four points \`p0, p1, p2, p3\`:

\`\`\`javascript
function CubicBezierCurve(t, p0, p1, p2, p3) { 
  return (1 - t)³ * p0 + 3 * (1 - t)² * t * p1 + 3 * (1 - t) * t² * p2 + t³ * p3
}\`\`\`

Unfortunately, we cannot solely rely on this formula as it only gives us the point on the curve at a given \`t\`, without its two control points.

Luckily, there is a simple recursive approximate algorithm that allows you to split a curve in two distinct Bézier curves at any given \`t\`, along its two control points called \`de Casteljau's algorithm\`.

For example if you were looking for a point on the Bézier curve at \`t = .25\`, given \`p0\`, \`p1\`, \`p2\`, and \`p3\`, with \`p1\`, and \`p2\` as the control points, you'd go look for \`p01\`, \`p12\` and \`p23\`, the respective points at \`t\` of \`(p0, p1)\`, \`(p1, p2)\`, and \`(p2, p3)\`.
You then repeat the same process and find \`pA\` and \`pB\` the respective points at \`t\` for \`(p01, p12)\`, and \`(p12, p23)\`. You can now get \`pT\` the point at \`t\` of \`(pA, pB)\`, which is also the point at \`t\` of the Bézier curve 

Here's the geometric representation of the algorithm:`
    },
    {
      type: 'FunctionalComponent',
      css: ``,
      component: function() {
        const sample = 10;
        const [t, setT] = React.useState(1);
        const points = [[0, 0], [0, 250], [290, 500], [500, 0]];

        useAlternateSetState((config) => {
          setT(n => {
            config.direction = n >= 10 ? -1: (n <= 0 ? 1: config.direction);
            return (n + config.direction);
          });
        });

        const first_pass = calculateSubs(t/sample, points);
        const second_pass = calculateSubs(t/sample, first_pass);
        const third_pass = calculateSubs(t/sample, second_pass);

        return <div className="markdown">
          <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
            <line x1={points[1][0]} y1={500 - points[1][1]} x2={points[2][0]} y2={500 - points[2][1]} stroke="black" strokeDasharray="10"/>
            {drawBezier(points)}
            <line x1={first_pass[0][0]} y1={500 - first_pass[0][1]} x2={first_pass[1][0]} y2={500 - first_pass[1][1]} stroke="#0a6bf2" strokeDasharray="10"/>
            <line x1={first_pass[1][0]} y1={500 - first_pass[1][1]} x2={first_pass[2][0]} y2={500 - first_pass[2][1]} stroke="#0a6bf2" strokeDasharray="10"/>
            <line x1={second_pass[0][0]} y1={500 - second_pass[0][1]} x2={second_pass[1][0]} y2={500 - second_pass[1][1]} stroke="#f8205d" strokeDasharray="10"/>

            <line x1={t/sample * 500} y1={0} x2={t/sample * 500} y2={500} stroke="#f8205d" />

            {first_pass.map(pt => <circle cx={pt[0]} cy={500 - pt[1]} r="8" fill="#0a6bf2" stroke="black" strokeWidth="4" />)}
            {second_pass.map(pt => <circle cx={pt[0]} cy={500 - pt[1]} r="8" fill="#f8205d" stroke="black" strokeWidth="4" />)}
            {drawCurve(points[0], points[1], points[2], points[3])}
            {third_pass.map(pt => <circle cx={pt[0]} cy={500 - pt[1]} r="12" fill="#ffd203" stroke="black" strokeWidth="4" />)}
          </svg>
          <p>
            <code>t = {t}</code><br/>
            <code>Actual x-position ≅ {Math.round(third_pass[0][0]/500 * 10)}</code>
          </p>
        </div>
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
          stroke="#f8205d" />
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
        const c = splitBCByT(targetTs, originalPoints, sample);
        const COLORS = ['black', 'white', 'black', 'white'];

        useAlternateSetState((config) => {
          setSample(n => {
            config.direction = n >= 100 ? -1: (n <= 6 ? 1: config.direction);
            return (n + config.direction * 6);
          });
        });

        return <div className="markdown">
          <p>
            With a sample rate of {sample}, we get the following four distinct bezier curves:<br />
            <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
              {c.map((pts, i) => drawCurve(pts[0], pts[1], pts[2], pts[3], COLORS[i]))}

              {targetTs.map(x => <line x1={x} y1={0} x2={x} y2={500} stroke="#f8205d" strokeWidth={1} shapeRendering="crispEdges" />)}
            </svg>
          </p>
        </div>
      }
    },
    {
      type: 'FunctionalComponent',
      component: function() {
        const [sample, setSample] = React.useState(100);
        const targetTs = [1/4 * 500, 2/4 * 500, 3/4 * 500];
        const originalPoints = [[0, 0], [0, 250], [290, 500], [500, 0]];
        const c = splitBCByT(targetTs, originalPoints, sample);
        const COLORS = ['black', 'white', 'black', 'white'];

        useAlternateSetState((config) => {
          setSample(n => {
            config.direction = n >= 100 ? -1: (n <= 6 ? 1: config.direction);
            return (n + config.direction * 6);
          });
        });

        return <div className="markdown">
          <p>
            With a sample rate of {sample}, we get the following four distinct bezier curves:<br />
            <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
              {c.map((pts, i) => drawCurve(pts[0], pts[1], pts[2], pts[3], COLORS[i]))}

              {targetTs.map(x => <line x1={x} y1={0} x2={x} y2={500} stroke="#f8205d" strokeWidth={1} shapeRendering="crispEdges" />)}
            </svg>
          </p>
        </div>
      }
    },
    {
      type: 'Markdown',
      content: `We now know how to split a Bézier curve into multiple smaller Bézier curves.

The first button below had the same ease applied across the three sub-elements, while the second button has the same ease split in three equal parts.`
    },
    {
      type: 'FunctionalComponent',
      css: `.btn--one {
        background: none;
        border: none;
        border-radius: 0;
        color: #feb2a8;
        cursor: pointer;
        font-size: 16px;
        display: block;
        position: relative;
      }
      
      .btn--one span {
        display: inline-block;
        overflow: hidden;
        position: relative;
      }
      
      .btn--one span:before {
        background: white;
        content: '';
        display: block;
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        transform: translateX(-105%);
        transition: transform 250ms var(--transition-delay) var(--transition-easing);
        width: 100%;
        z-index: -1;
      }
      
      .wrapper__button-one:hover span:before {
        transform: translateX(0%);
        transition-delay: var(--transition-delay-hover);
      }
      `,
      component: function component() {
        const targetTs = [1/3 * 500, 2/3 * 500];
        const originalPoints = [[0, 0], [0, 250], [290, 500], [500, 0]];

        const styleOne = {
          '--transition-delay': '500ms',
          '--transition-delay-hover': '0ms',
          '--transition-easing': 'cubic-bezier(0, 0, 1, 1)',
        };

        const styleTwo = {
          '--transition-delay': '250ms',
          '--transition-delay-hover': '250ms',
          '--transition-easing': 'cubic-bezier(0, 0, 1, 1)',
        };

        const styleThree = {
          '--transition-delay': '0ms',
          '--transition-delay-hover': '500ms',
          '--transition-easing': 'cubic-bezier(0, 0, 1, 1)',
        };

        const styleOneFixed = {
          ...styleOne,
          '--transition-easing': 'cubic-bezier(0, 0, 1, 1)',
        };

        const styleTwoFixed = {
          ...styleTwo,
          '--transition-easing': 'cubic-bezier(0, 0, 1, 1)',
        };

        const styleThreeFixed = {
          ...styleThree,
          '--transition-easing': 'cubic-bezier(0, 0, 1, 1)',
        };

        return <div className="wrapper__button-one">
          <button className="btn--one" type="button">
            <span style={styleOne}>Tempor&nbsp;</span>
            <span style={styleTwo}>Labore&nbsp;</span>
            <span style={styleThree}>Dolore&nbsp;</span>
          </button>
          <br />
          <button className="btn--one" type="button">
            <span style={styleOneFixed}>Tempor&nbsp;</span>
            <span style={styleTwoFixed}>Labore&nbsp;</span>
            <span style={styleThreeFixed}>Dolore&nbsp;</span>
          </button>
        </div>;
      }
    },
    /*{
      type: 'Markdown',
      content: `We now know how to split a Bézier curve into multiple smaller Bézier curves.

What we need is to split the bezier curve such that the distance (y-axis) is spilt to match our \`\<span \/\>\` elements, then find their respective \`t\`s. (I plan to update the graph below, so this makes more sense).

For most \`ease-out\` type of animations we can just apply the previous algorithm on the y-axis.
However, we have to account for animations such as bounce or elastic, where the animation can momentarily reverse.
Let's use \`cubic-bezier(0.75, 2, 0, -1)\` as our example from hereon.

[Will finish this eventually.]`
    },*/
    /*{
      type: 'FunctionalComponent',
      css: ``,
      component: function component() {
        const [offset, setOffset] = React.useState(0);
        const targetDs = [1/4 * 500, 2/4 * 500, 3/4 * 500].map(n => (n + offset));
        // cubic-bezier(0.75, 2, 0, -1);
        const originalPoints = [[0, 0], [375, 1000], [0, -500], [500, 500]];
        const c = splitBCByD(targetDs, originalPoints, 100);
        const COLORS = ['blue', 'white', 'red', 'pink'];

        useAlternateSetState((config) => {
          setOffset(n => {
            config.direction = n >= 100 ? -1: (n <= 6 ? 1: config.direction);
            return (n + config.direction * 6);
          });
        });

        const sample = 100;
        const sampledPoints = Array.from(Array(sample + 1), (_, i) => CubicBezierCurve(i/sample, originalPoints));
        const track = [0];
        for (let i = 0; i<targetDs.length; i++) {
          for(let j = 1; j < sampledPoints.length; j++) {
            if(sampledPoints[j][1] > targetDs[i] && sampledPoints[j - 1][1] < targetDs[i]) {
              const diff = Math.abs(sampledPoints[j][1] - targetDs[i]);
              const pDiff = Math.abs(sampledPoints[j - 1][1] - targetDs[i]);
              if(diff < pDiff) {
                track.push(j);
              } else {
                track.push(j)
              }
            }
          }
        }
        track.push(sampledPoints.length - 1);

        return <div className="markdown">
          <p>
            <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
              {c.map((pts, i) => drawCurve(pts[0], pts[1], pts[2], pts[3], COLORS[i]))}

              {targetDs.map(y => <line x1={0} y1={y} x2={500} y2={y} stroke="#f8205d" strokeWidth={1} shapeRendering="crispEdges" />)}

              {track.map(j => {
                const p = sampledPoints[j];
                return <circle cx={p[0]} cy={500 - p[1]} r="10" fill="blue" shapeRendering="crispEdges"/>;
              })}
            </svg>
          </p>
        </div>
      }
    },*/
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
        const c = splitBCByT(targetTs, originalPoints, 20);

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

// de Casteljau's algorithm
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
  return <path d={`M${p0[0]},${500 - p0[1]} C${p1[0]},${500 - p1[1]} ${p2[0]},${500 - p2[1]} ${p3[0]},${500 - p3[1]}`} stroke={stroke} style={{strokeWidth: 2}} />
}

function drawBezier([p0, p1, p2, p3]) {
  return <React.Fragment>
    <circle cx={p0[0]} cy={500 - p0[1]} r="15" fill="black" stroke="none" />
    <circle cx={p3[0]} cy={500 - p3[1]} r="15" fill="black" stroke="none" />
    <line x1={p0[0]} y1={500 - p0[1]} x2={p1[0]} y2={500 - p1[1]} stroke="black" strokeDasharray="10"/>
    <line x1={p2[0]} y1={500 - p2[1]} x2={p3[0]} y2={500 - p3[1]} stroke="black" strokeDasharray="10"/>
    <circle cx={p1[0]} cy={500 - p1[1]} r="15" fill="#f1f1f1" stroke="black" />
    <circle cx={p2[0]} cy={500 - p2[1]} r="15" fill="#f1f1f1" stroke="black" />
  </React.Fragment>
}

/**
 * Given an array targetTs of target Ts, this function splits the original Bézier curve defined by the points
 * in originalPoints, into targetTs.length.
 * @param targetTs
 * @param originalPoints
 * @param sample
 * @returns {[]}
 */
function splitBCByT(targetTs, originalPoints, sample = 20) {
  let nPoints = [];
  let curryOverPoints = originalPoints;
  for (let i = 0; i < targetTs.length; i++) {
    const points = splitCurveAt(getApproximateT(targetTs[i], curryOverPoints), curryOverPoints);
    nPoints.push(points[0]);
    curryOverPoints = points[1];
  }
  nPoints.push(curryOverPoints);

  return nPoints;
}

function getApproximateT(t, points, sample = 20) {
  let closestPt = null;
  let diff = null;

  for (let  i = 0; i < sample; i++) {
    const r = i/sample;
    const sampledCB = CubicBezierCurve(r, points);
    if(closestPt === null) {
      closestPt = [r, ...sampledCB]; // [r, x, y]
      diff = Math.abs(t - sampledCB[0]); // x
    } else {
      const nDiff = Math.abs(t - sampledCB[0]); // x

      if(nDiff < diff) {
        closestPt = [r, ...sampledCB]; // [t, x, y]
        diff = nDiff;
      }
    }
  }

  return closestPt[0];
}

function splitBCByD(targetDs, originalPoints, sample = 20) {
  let points = null;
  let _sample = sample;
  const combinedBC = [];

  for(let i = 0; i < targetDs.length; i++) {
    let diff = -1;

    if(i === 0) {
      points = originalPoints.slice(0);
    } else {
      // we reduce the sample size.
      _sample -= sample/targetDs.length | 0;
    }

    for(let ii = 0; ii <= _sample; ii++) {
      const y = CubicBezierCurve(ii/_sample, points)[1];

      if(diff === -1) {
        diff = Math.abs(targetDs[i] - y);
      } else {
        const newDiff = Math.abs(targetDs[i] - y);
        if(newDiff < diff) {
          diff = newDiff;
        } else {
          const splitBC = splitCurveAt((ii - 1)/_sample, points);
          points = splitBC[1];
          combinedBC.push(splitBC[0]);

          if(i + 1 === targetDs.length) {
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
