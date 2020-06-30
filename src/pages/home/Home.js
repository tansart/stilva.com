import React, { memo } from 'react';
import { css } from 'linaria';

import Greetings from '../../components/Greetings';
import AnimatedLink from '../../components/AnimatedLink';
import BasePage from '../../pages/BasePage';
import Background from "../Home/Background";
import {mq} from '../../utils/css-utils';

const pagragraph = css`
  color: white;
  font-size: 22px;
  
  @media ${mq.ML} {
    font-size: 5.6vw;
  }
  
  @media ${mq.TS} {
    font-size: 36px;
  }
  
  @media ${mq.T} {
    font-size: 42px;
  }
`;

export default memo(function Home({transitionstate}) {
  const props = {
    background: Background,
    section:'home',
    transitionstate
  };

  return <BasePage
    {...props}
  >
    <p className={pagragraph}>
      <Greetings/><br/>
      I'm <AnimatedLink link="https://github.com/stilva" label="Thomas Ansart" target="_blank" rel="noreferrer" />,
      a senior software engineer at Paperless Post, NY. Previously principal developer at Firstborn
    </p>
    <p className={pagragraph}>
      My day job involves engineering solutions, creating pixel perfect, and delightful UIs. Here's some of my <AnimatedLink link="work" label="work" key="lab"/>
    </p>
    <p className={pagragraph}>
      At night, I spend my time building UIs, writing code, or actively exploring Machine Learning (tensorflow/Python), with my pug Nugget on my laps.
      Check out my <AnimatedLink link="lab" label="Lab" key="lab"/>
    </p>
    <p className={pagragraph}>
      Always down for a <AnimatedLink onClick={onContact} label="chat" rel="nofollow"/> over a drink
    </p>
  </BasePage>
});

function onContact(e) {
  e.preventDefault();

  location.href = `mailto:${atob('dGhvbWFzLmFuc2FydEA=')}${atob('c3RpbHZhLmNvbQ==')}`;
}
