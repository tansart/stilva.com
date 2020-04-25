import React from 'react';

class AnimationManager {
  static QUEUE = [];

  constructor() {
    requestAnimationFrame(this.update);
  }

  add(animation) {
    if(animation instanceof Animation) {
      AnimationManager.QUEUE.push(animation);
    }

    return this;
  }

  remove(animation) {
    for (let i = 0; i < AnimationManager.QUEUE.length; i++) {
      if(AnimationManager.QUEUE[i] === animation) {
        AnimationManager.QUEUE.splice(i, 1);
      }
    }

    return this;
  }

  update = () => {
    let time = Date.now();

    for(let i = 0; i < AnimationManager.QUEUE.length; i++) {
      const animation = AnimationManager.QUEUE[i];
      let config = animation.config;

      let lastTime;

      for(let j = 0; j < animation.length; j++) {
        const anim = animation.getValues(j);
        // If an animation is done, skip, until all of them conclude
        if (anim.done) {
          continue;
        }

        let to = anim.toValue;
        let position = anim.lastPosition;
        let velocity = config.initialVelocity;

        /** Spring easing */
        lastTime = anim.lastTime !== void 0 ? anim.lastTime : time
        velocity =
          anim.lastVelocity !== void 0
            ? anim.lastVelocity
            : config.initialVelocity;

        // If we lost a lot of frames just jump to the end.
        if (time > lastTime + 64) {
          lastTime = time;
        }
        // http://gafferongames.com/game-physics/fix-your-timestep/
        let numSteps = Math.floor(time - lastTime);
        for (let i = 0; i < numSteps; ++i) {
          let force = -config.tension * (position - to);
          let damping = -config.friction * velocity;
          let acceleration = (force + damping) / config.mass;
          velocity = velocity + (acceleration * 1) / 1000;
          position = position + (velocity * 1) / 1000;
        }

        let isVelocity = Math.abs(velocity) <= config.precision;
        let isDisplacement = Math.abs(to - position) <= config.precision;

        anim.lastVelocity = velocity;
        anim.lastTime = time;

        if ((isVelocity && isDisplacement)) {
          // Ensure that we end up with a round value
          if (anim.value !== to) {
            position = to;
          }

          anim.done = true;
        } else {

          // isDone = false;
        }

        anim.lastPosition = position;
        animation.updateValue();
      }
    }

    requestAnimationFrame(this.update)
  }
}

class Animation {

  get length() {
    return this._keys.length;
  }

  get config() {
    return this._config;
  }

  constructor(values, config) {
    this._callbacks = [];
    this._keys = [];
    this._values = {};
    this._config = {
      initialVelocity: 0,
      friction: 26,
      mass: 1,
      precision: 0.01,
      tension: 170,
      ...config
    };

    for (let val in values) {
      this._values[val] = {
        done: true,
        toValue: values[val],
        lastPosition: values[val],
        lastTime: void 0,
        lastVelocity: void 0,
      };

      this._keys.push(val);
    }
  }

  updateValue() {
    this._callbacks.forEach(cb => cb(this._values));
  }

  set(obj) {
    for (let val in obj) {
      if(!this._values.hasOwnProperty(val) || this._values[val] === obj[val]) {
        continue;
      }

      this._values[val] = {
        ...this._values[val],
        done: false,
        lastVelocity: void 0,
        toValue: obj[val]
      };
    }
  }

  interpolate(fn) {
    return (node, cssProp) => {
      this._callbacks.push(() => {
        node.style[cssProp] = fn(this._values);
      });
      return this;
    };
  }

  getValues(i) {
    return this._values[this._keys[i]];
  }
}

function useSpring(defaultValues, config) {
  const animation = React.useRef(null);
  const [values, setValues] = React.useState(null);

  if(!animation.current) {
    animation.current = new Animation(defaultValues, config);
  }

  return [values || animation.current, (style) => {
    animation.current.set(style);
    setValues(animation.current);
  }];
}

class Animated extends React.Component {
  static MANAGER = null;

  constructor(props) {
    super(props);

    this._ref = React.createRef();
    Animated.MANAGER = Animated.MANAGER || new AnimationManager();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.style !== this.props.style) {
      Object.keys(prevProps.style).forEach(cssProp => {
        Animated.MANAGER.remove(prevProps.style[cssProp]);
      });
      Object.keys(this.props.style).forEach(cssProp => {
        Animated.MANAGER.add(this.props.style[cssProp](this._ref.current, cssProp));
      });
    }
  }

  componentWillUnmount() {
    // clean
    Object.keys(this.props.style).forEach(cssProp => {
      Animated.MANAGER.remove(this.props.style[cssProp]);
    });
  }

  render() {
    const {children, type, animatedProps, ...props} = this.props;

    return React.createElement(type, {...props, ref: this._ref}, children);
  }
}

Animated.div = React.forwardRef(({children, ...props}, ref) => (
  <Animated ref={ref} type={'div'} {...props}>
    {children}
  </Animated>
));

function LastUpdated() {
  return <span>
    {Date.now()}
  </span>
}

export default {
  link: 'spring-animation',
  title: `Spring animation`,
  date: `April 2020`,
  categories: 'web',
  content: [
    {
      type: 'Markdown',
      content: `For most CSS animations, I usually use \`@keyframes\` when there's no interaction, and CSS \`transition\` when there's user interaction.
This obviously isn't always applicable but for most part, \`transition\`'s ability to animate from an arbitrary value works better.

However, \`transition\` still has its own constraint: \`transition-duration\`. Dynamically tweaking the \`transition-duration\` with some JS and added velocity is usually my lightweight go-to solution.
When you can afford adding around \`10kb\` gzipped, is when I'd reach out to libraries such as \`react-spring\` (or the original, and smaller \`react-motion\`).`
    },
    {
      type: 'Markdown',
      content: `In this post, I thought I'd write about an ad-hoc spring component.`
    },
    {
      type: 'FunctionalComponent',
      css: ``,
      component: function () {
        const [counter, setCounter] = React.useState(0);
        const [animatedProps, setAnimatedProps] = useSpring({
          x: 0,
          yPercent: 0
        }, { tension: 25});

        React.useEffect(() => {
          setTimeout(() => {
            setAnimatedProps({
              x: 150,
              yPercent: 200
            })
          }, 1000);

          setTimeout(() => {
            setAnimatedProps({
              x: 100,
              yPercent: 100
            })
          }, 2500);
        }, []);

        class Toto {
          constructor() {
          }

          b() {
            console.log('b')
          }
        }

        const T = new Proxy(Toto, {
          get: (obj, prop) => {
            console.log('get::', prop);
            return () => {};
          },
          construct: (target, argumentsList, newTarget) => {
            return new Toto(...argumentsList);
          }
        });

const t = new T();
console.log(T.hi);
console.log(T.no)

        return <Animated.div style={{
          transform: animatedProps.interpolate(({x, yPercent}) => `translate3d(${x.lastPosition}px, ${yPercent.lastPosition}%, 0)`)
        }} onClick={() => setCounter(counter + 1)}>
          <span>Hello</span>
          <h1>counter: {counter}</h1>
          <LastUpdated />
        </Animated.div>;
      }
    },
  ]
};
