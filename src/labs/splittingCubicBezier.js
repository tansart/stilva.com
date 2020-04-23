import React from 'react';

export default {
  link: 'splitting-cubic-bezier',
  title: `Splitting a cubic Bézier curve`,
  date: `November 2019`,
  categories: 'web',
  content: [
    {
      type: 'Markdown',
      content: `In this post, I thought I'd go over how to split Bézier curves into an arbitrary number of smaller Bézier curves.
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
          hover on me
        </button>;
      }
    },
    {
      type: 'Markdown',
      content: `There's a very straight-forward hover animation, with a pseudo element that has a \`transform: translateX();\` applied on hover.
There's also a simple \`ease-out\` applied to the \`transition\` so it's nice a smooth.

Unfortunately, things quickly break when you have two or more lines:`
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

The next solution was to split the button's text into smaller elements and to apply multiple \`transition-delay\` to each, to stagger the animation – 
it's also worth noting that the \`transition-delay\` needs to be applied inversely to \`element:hover {}\` so the first element animates last when you hover out.`
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

Luckily, there is a simple recursive approximate algorithm called \`de Casteljau's algorithm\`, which allows you to split a curve into two distinct Bézier curves at any given \`t\`.

For example if you were looking for a point on the Bézier curve at \`t = .25\`, given \`p0\`, \`p1\`, \`p2\`, and \`p3\`, with \`p1\`, and \`p2\` as the control points, you'd go look for \`p01\`, \`p12\` and \`p23\`, the respective points at \`t\` of \`(p0, p1)\`, \`(p1, p2)\`, and \`(p2, p3)\`.
You then repeat the same process and find \`pA\` and \`pB\` the respective points at \`t\` of \`(p01, p12)\`, and \`(p12, p23)\`. You can now get \`pT\` the point at \`t\` of \`(pA, pB)\`, which is also the point at \`t\` of the Bézier curve 

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
            <code>t = {t/sample}</code><br/>
            <code>Actual x-position ≅ {Math.round(third_pass[0][0]/500 * 10)/10}</code>
          </p>
        </div>
      }
    },
    {
      type: 'Markdown',
      content: `We're almost there. Given the text will vary in length, we'll need to split the Bézier curve on the y-axis. And here's the tricky part: how to find all the intersecting points between the line and the Bézier curve? Luckily, the heavy lifting was already done [here](https://www.particleincell.com/2013/cubic-line-intersection/)`
    },
    {
      type: 'Markdown',
      content: `The first button below had the same ease applied across the three sub-elements, while the second button has the same ease split in three equal parts.`
    },
    {
      type: 'FunctionalComponent',
      css: `.btn--one {
        background: none;
        border: none;
        border-radius: 0;
        color: #feb2a8;
        cursor: pointer;
        display: block;
        font-size: 16px;
        overflow: hidden;
        padding: 0;
        position: relative;
      }
      
      .btn--one:before {
        background: red;
        content: '';
        height: 2px;
        position: absolute;
        transform: translateX(-105%);
        transition: transform 750ms;
        transition-timing-function: inherit;
        width: 100%;
        z-index: 2;
      }
      
      .btn--one span {
        background: blue;
        display: inline-block;
        height: 25px;
        overflow: hidden;
        position: relative;
        width: 55px;
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
        transition: transform var(--transition-duration) var(--transition-delay) var(--transition-easing);
        width: 100%;
        z-index: 1;
      }
      
      .wrapper__button-one:hover span:before {
        transform: translateX(0%);
        transition-delay: var(--transition-delay-hover);
        transition-duration: var(--transition-duration-hover);
        transition-timing-function: var(--transition-easing-hover);
      }
      
      .wrapper__button-one:hover .btn--one:before {
        transform: translateX(0%);
      }
      `,
      component: function component() {
        function clamp(x) {
          return Math.max(Math.min(x, 1), 0);
        }

        // TMP, don't look at me!
        function norm(pts) {
          return pts.map((pt) => {
            const xDiff = 1/((pt[3].x - pt[0].x));
            const yDiff = 1/((pt[3].y - pt[0].y));
            const t = (pt[3].x - pt[0].x);
            const begDelta = pt[0].x;
            const endDelta = pt[3].x;

            return pt.map(({x, y}) => ({
              t,
              begDelta,
              endDelta,
              x: clamp((x - pt[0].x) * xDiff),
              y: (y - pt[0].y) * yDiff
            }))
          });
        }

        const targetTs = [1/3, 2/3];
        const cbPts = [0, 0, .58, 1];
        // const cbPts = [.75, 2, 0, -1];
        const originalPoints = [[0, 0], [cbPts[0], cbPts[1]], [cbPts[2], cbPts[3]], [1, 1]];

        const splitCurves = new SplitBZCurve(originalPoints, targetTs);

        const styleOneFixed = {
          '--transition-duration': `${(splitCurves.offsets[2][1] - splitCurves.offsets[2][0]) * 750}ms`,
          '--transition-duration-hover': `${(splitCurves.offsets[0][1] - splitCurves.offsets[0][0]) * 750}ms`,
          '--transition-delay': `${splitCurves.offsets[2][0] * 750}ms`,
          '--transition-delay-hover': `${splitCurves.offsets[0][0] * 750}ms`,
          '--transition-easing': splitCurves.getCSS(2),
          '--transition-easing-hover': splitCurves.getCSS(0)
        };

        const styleTwoFixed = {
          '--transition-duration': `${(splitCurves.offsets[1][1] - splitCurves.offsets[1][0]) * 750}ms`,
          '--transition-duration-hover': `${(splitCurves.offsets[1][1] - splitCurves.offsets[1][0]) * 750}ms`,
          '--transition-delay': `${splitCurves.offsets[1][0] * 750}ms`,
          '--transition-delay-hover': `${splitCurves.offsets[1][0] * 750}ms`,
          '--transition-easing': splitCurves.getCSS(1),
          '--transition-easing-hover': splitCurves.getCSS(1)
        };

        const styleThreeFixed = {
          '--transition-duration': `${(splitCurves.offsets[0][1] - splitCurves.offsets[0][0]) * 750}ms`,
          '--transition-duration-hover': `${(splitCurves.offsets[2][1] - splitCurves.offsets[2][0]) * 750}ms`,
          '--transition-delay': `${splitCurves.offsets[0][0] * 750}ms`,
          '--transition-delay-hover': `${splitCurves.offsets[2][0] * 750}ms`,
          '--transition-easing': splitCurves.getCSS(0),
          '--transition-easing-hover': splitCurves.getCSS(2)
        };

        return <div className="wrapper__button-one">
          <svg viewBox="-50 -50 600 600" className="cb-svg" xmlns="http://www.w3.org/2000/svg">
            {drawCurve([0, 0], [cbPts[0] * 500, cbPts[1] * 500], [cbPts[2] * 500, cbPts[3] * 500], [500, 500])}

            {targetTs.map(y => <line x1={0} y1={500 - y * 500} x2={500} y2={500 - y * 500} stroke="#f8205d" strokeWidth={1} shapeRendering="crispEdges" />)}
          </svg>

          <button className="btn--one" type="button" style={{transitionTimingFunction: `cubic-bezier(${cbPts[0]}, ${cbPts[1]}, ${cbPts[2]}, ${cbPts[3]})`}}>
            <span style={styleOneFixed} />
            <span style={styleTwoFixed} />
            <span style={styleThreeFixed} />
          </button>
        </div>;
      }
    },
  ]
};

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

function drawCurve(p0, p1, p2, p3, stroke='black', thickness = 2) {
  return <path d={`M${p0[0]},${500 - p0[1]} C${p1[0]},${500 - p1[1]} ${p2[0]},${500 - p2[1]} ${p3[0]},${500 - p3[1]}`} stroke={stroke} style={{strokeWidth: thickness}} />
}

function drawCurveXY(p0, p1, p2, p3, stroke='black', thickness = 2) {
  return <path d={`M${p0.x},${500 - p0.y} C${p1.x},${500 - p1.y} ${p2.x},${500 - p2.y} ${p3.x},${500 - p3.y}`} stroke={stroke} style={{strokeWidth: thickness}} />
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

function splitCurveAt(r, points) {
  const first_pass = calculateSubs(r, points);
  const second_pass = calculateSubs(r, first_pass);
  const third_pass = calculateSubs(r, second_pass);

  return [
    [points[0], first_pass[0], second_pass[0], third_pass[0]],
    [third_pass[0], second_pass[1], first_pass[2], points[3]]
  ]
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

// https://www.particleincell.com/2013/cubic-line-intersection/
function computeIntersections(px, py, lx, ly) {
  var A=ly[1] - ly[0];	    //A=y2-y1
  var B=lx[0] - lx[1];	    //B=x1-x2
  var C=lx[0] * (ly[0]-ly[1]) + ly[0]*(lx[1]-lx[0]);	//C=x1*(y1-y2)+y1*(x2-x1)

  var bx = bezierCoeffs(px[0], px[1] ,px[2], px[3]);
  var by = bezierCoeffs(py[0], py[1] ,py[2], py[3]);

  const P = [
    A*bx[0]+B*by[0],		/*t^3*/
    A*bx[1]+B*by[1],		/*t^2*/
    A*bx[2]+B*by[2],		/*t*/
    A*bx[3]+B*by[3] + C	/*1*/
  ];

  return cubicRoots(P).map(t => ({
    t,
    x: bx[0]*t*t*t+bx[1]*t*t+bx[2]*t+bx[3],
    y: by[0]*t*t*t+by[1]*t*t+by[2]*t+by[3]
  }));
}

function bezierCoeffs(P0,P1,P2,P3) {
  return [
    -P0 + 3*P1 + -3*P2 + P3,
    3*P0 - 6*P1 + 3*P2,
    -3*P0 + 3*P1,
    P0
  ];
}

function cubicRoots([a,b,c,d]) {
  let A = b/a;
  const B = c/a;
  const C = d/a;

  const Q = (3*B - Math.pow(A, 2))/9;
  const R = (9*A*B - 27*C - 2*Math.pow(A, 3))/54;
  const D = Math.pow(Q, 3) + Math.pow(R, 2);    // polynomial discriminant

  A = A/3;

  // complex or duplicate roots
  if (D >= 0) {
    const S = Math.cbrt(R + Math.sqrt(D));
    const T = Math.cbrt(R - Math.sqrt(D));

    if(Math.abs(Math.sqrt(3)*(S - T)/2) !== 0) {
      return [-A + (S + T)];
    } else {
      return customFilter([
        -A + (S + T),
        -A - (S + T)/2,
        -A - (S + T)/2
      ]);
    }
  } else {
    // distinct real roots
    var th = Math.acos(R/Math.sqrt(-Math.pow(Q, 3)));

    return customFilter([
      2 * Math.sqrt(-Q) * Math.cos(th/3) - A,
      2 * Math.sqrt(-Q) * Math.cos((th + 2 * Math.PI)/3) - A,
      2 * Math.sqrt(-Q) * Math.cos((th + 4 * Math.PI)/3) - A
    ]);
  }
}

function customFilter(input) {
  return input
    .filter(t => (t>0 && t<1))
    .sort();
}

function normaliseCurves(pts) {
  return pts.map((pt) => {
    const xDiff = 1/((pt[3][0] - pt[0][0]));
    const yDiff = 1/((pt[3][1] - pt[0][1]));

    return pt.map(([x, y]) => [
      Math.max(Math.min(((x - pt[0][0]) * xDiff), 1), 0), // clamps to [0, 1]
      (y - pt[0][1]) * yDiff
    ])
  });
}

class SplitBZCurve {

  static PRECISION = 100;

  constructor(pts, t) {
    this.pts = pts;

    const interSections = this.intersect(Array.isArray(t) ? t: [t]);

    this._init(interSections);
  }

  intersect(ts) {
    return ts.map(pt => computeIntersections(
      [this.pts[0][0], this.pts[1][0], this.pts[2][0], this.pts[3][0]],
      [this.pts[0][1], this.pts[1][1], this.pts[2][1], this.pts[3][1]],
      [this.pts[0][0], this.pts[3][0]],
      [pt, pt]
    ));
  }

  getCSS(curveIndex) {
    return `cubic-bezier(${this.curves[curveIndex][1][0]}, ${this.curves[curveIndex][1][1]}, ${this.curves[curveIndex][2][0]}, ${this.curves[curveIndex][2][1]})`;
  }

  _init(interSections) {
    const curves = [];
    const offset = [];
    const startEndPts = [];

    for (let i = 0; i < interSections.length; i++) {
      const prevIndex = i - 1;
      startEndPts.push(prevIndex === -1 ? [{t: 0, x: 0, y: 0}]: [interSections[prevIndex][0]]);

      if(interSections[i].length > 1) {
        startEndPts[i] = startEndPts[i].concat(interSections[i][2]);
      } else {
        startEndPts[i] = startEndPts[i].concat(interSections[i][0]);
      }
    }

    for(let i = 0; i < startEndPts.length; i++) {
      let pts = splitCurveAt(startEndPts[i][0].t, this.pts);
      pts = splitCurveAt(startEndPts[i][1].t, pts[1]);
      curves.push(pts[0]);
      offset.push([startEndPts[i][0].x, startEndPts[i][1].x]);

      if(i + 1 === startEndPts.length) {
        curves.push(pts[1]);
        offset.push([startEndPts[i][1].x, 1]);
      }
    }

    this.curves = normaliseCurves(curves);
    this.offsets = offset;
  }
}
