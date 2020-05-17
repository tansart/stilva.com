// https://www.particleincell.com/2013/cubic-line-intersection/
function computeIntersections(p1x, p1y, p2x, p2y, x) {
  if(x === 0) return 0;
  if(x === 1) return 1;

  var bx = bezierCoeffs(p1x ,p2x);
  var by = bezierCoeffs(p1y ,p2y);

  return cubicRoots(bx[1]/bx[0], bx[2]/bx[0], -x/bx[0]).map(t => by[0]*t*t*t+by[1]*t*t+by[2]*t);
}

function bezierCoeffs(P1,P2) {
  return [
    3*P1 + -3*P2 + 1,
    -6*P1 + 3*P2,
    3*P1
  ];
}

function cubicRoots(a,b,c) {
  let A = a;
  const B = b;
  const C = c;

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

const BezierEasing = function _BezierEasing() {
  var NEWTON_ITERATIONS = 4;
  var NEWTON_MIN_SLOPE = 0.001;
  var SUBDIVISION_PRECISION = 0.0000001;
  var SUBDIVISION_MAX_ITERATIONS = 10;

  var kSplineTableSize = 11;
  var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

  var float32ArraySupported = typeof Float32Array === 'function';

  function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
  function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
  function C (aA1)      { return 3.0 * aA1; }
  function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }
  function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

  function binarySubdivide (aX, aA, aB, mX1, mX2) {
    var currentX, currentT, i = 0;
    do {
      currentT = aA + (aB - aA) / 2.0;
      currentX = calcBezier(currentT, mX1, mX2) - aX;
      if (currentX > 0.0) {
        aB = currentT;
      } else {
        aA = currentT;
      }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
  }

  function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
    for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
      var currentSlope = getSlope(aGuessT, mX1, mX2);
      if (currentSlope === 0.0) {
        return aGuessT;
      }
      var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
      aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
  }

  function LinearEasing (x) {
    return x;
  }

  return function bezier (mX1, mY1, mX2, mY2) {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
      throw new Error('bezier x values must be in [0, 1] range');
    }

    if (mX1 === mY1 && mX2 === mY2) {
      return LinearEasing;
    }

    // Precompute samples table
    var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
    for (var i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }

    function getTForX (aX) {
      var intervalStart = 0.0;
      var currentSample = 1;
      var lastSample = kSplineTableSize - 1;

      for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      var guessForT = intervalStart + dist * kSampleStepSize;

      var initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
      }
    }

    return function BezierEasing (x) {
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0 || x === 1) {
        return x;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  };
}();

export default BezierEasing;
