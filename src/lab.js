// 'mediapipe': require('./labs/mediapipe/index').default,
// 'refactor-06-2020': require('./labs/refactor-06-2020').default,
export default new Map(injectIndex([
  // ['splittable-bezier-component', {
  //   label: 'Splittable Bézier component'
  // }],
  // ['face-from-landmarks', {
  //   label: 'Face from landmarks'
  // }],
  ['instance-normalization', {
    label: 'Instance Normalization with tfjs'
  }],
  ['drop-table-shadow-maker', {
    label: 'Drop-table-shadow maker'
  }],
  ['real-time-style-transfer-with-tensorflowjs', {
    label: 'Real-time style transfer with tensorflow.js'
  }],
  ['adain-with-mediapipe', {
    label: 'AdaIN with MediaPipe'
  }],
  ['mediapipe', {
    label: 'MediaPipe'
  }],
  ['refactor', {
    label: 'Refactoring the Folio'
  }],
  ['glsl-ui-animation', {
    label: 'GLSL UI animation'
  }],
  ['spring-animation', {
    label: 'Spring animation'
  }],
  ['splitting-cubic-bezier', {
    label: 'Splitting a cubic Bézier curve'
  }],
  ['transitionable-react-router', {
    label: 'React Transitionable Route'
  }],
  ['markdown', {
    label: 'Markdown'
  }],
  ['glsl', {
    label: 'GLSL'
  }]
]));

function injectIndex(data) {
  return data.map((d, i) => {
    d[1].index = data.length - i;
    return d;
  })
}
