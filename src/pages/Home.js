import React, {memo, useEffect} from 'react';
import cx from 'classnames';

import Greetings from '../components/Greetings';
import AnimatedLink from '../components/AnimatedLink';

import useOnScroll from '../hooks/useOnScroll';

export default memo(function Home(props) {
  const scrollY = useOnScroll(props.transitionState, props.subCategory);

  useEffect(_ => {
    const html = document.querySelector('html');
    html.style.background = '#000';

    return function clean() {
      html.style.background = '';
    }
  }, []);

  return <div className={cx('page--left', `page--${props.transitionState}`)}>
    <div className="home" style={{transform: `translate3d(0,-${scrollY}px,0)`}}>
      <div className="content">
        <p>
          <Greetings/><br/>
          I'm <AnimatedLink link="https://github.com/stilva" label="Thomas Ansart" target="_blank"/>,
          a senior software engineer at <AnimatedLink link="https://bit.ly/1tx8iPZ" label="Paperless Post" rel="nofollow" target="_blank" />, NY. Previously principal developer at <AnimatedLink link="https://bit.ly/2Mm1IYx" label="Firstborn" rel="nofollow" target="_blank" />
        </p>
        <p>
          My day job involves engineering solutions, creating pixel perfect, and delightful UIs.
        </p>
        <p>
          At night, I spend my time building UIs, writing code, or actively exploring Machine Learning (tensorflow/Python), with my pug Nugget on my laps.
          Check out my <AnimatedLink link="lab" label="Lab" key="lab"/>.
        </p>
        <p>
          From 2007 to early 2019, I worked at various web agencies around the world, for multiple <AnimatedLink link="client" label="major clients" key="client" />
        </p>
        <p>
          Always down for a <AnimatedLink onClick={onContact} label="chat" rel="nofollow"/> over a drink.
        </p>
      </div>
    </div>
  </div>
});

function onContact(e) {
  e.preventDefault();

  location.href = `mailto:${atob('dGhvbWFzLmFuc2FydEA=')}${atob('c3RpbHZhLmNvbQ==')}`;
}

function getClientList(clients) {
  return Array.from(clients)
    .reduce((acc, [key, data], i, original) => {

      acc.push(<AnimatedLink link={`/client/${key}`} label={data.label} key={`client_list_${key}`}/>);

      if (i + 1 < original.length) {
        acc.push(i + 2 === original.length ? ', and ' : ', ');
      }

      return acc;
    }, [])
}
