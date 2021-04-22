import React, {memo, useContext} from 'react';
import { css, cx } from 'linaria';

import Greetings from '../../components/Greetings';
import AnimatedLink from '../../components/AnimatedLink';
import BasePage from '../../pages/BasePage';
import Background from "../home/Background";
import {mq} from '../../utils/css-utils';
import {RouterContext} from "@stilva/transitionable-react-router";

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

const first = css`
  margin-top: 0;
`;

export default memo(function Home({transitionstate}) {
  const {previousRoute} = useContext(RouterContext);

  const props = {
    background: Background,
    section:'home',
    transitionstate
  };

  return <BasePage
    {...props}
  >
    <p className={cx(pagragraph, first)}>
      <Greetings/><br/>
      I'm Thomas Ansart (<AnimatedLink link="https://github.com/stilva" label="Github" target="_blank" rel="noreferrer" />, <AnimatedLink link="https://www.twitter.com/tansart" label="Twitter" target="_blank" rel="noreferrer" />),
      a senior software engineer at Paperless Post, NY. Previously principal developer at Firstborn
    </p>
    <p className={pagragraph}>
      At night, I spend my time building UIs, writing code, or actively exploring Machine Learning (tensorflow/Python), with my pug Nugget on my lap.
      Check out my <AnimatedLink link="lab" label="Lab" key="lab"/>
    </p>
    <p className={pagragraph}>
      My day job involves engineering solutions, creating pixel perfect, and delightful UIs. Here's some of my <AnimatedLink link="work" label="work" key="lab"/>
    </p>
    <p className={pagragraph}>
      Always down for a <AnimatedLink onClick={onContact} label="chat" rel="nofollow"/> over a drink
    </p>
    <Background previousRoute={previousRoute} transitionstate={transitionstate} />
  </BasePage>
});

function onContact(e) {
  e.preventDefault();

  location.href = `mailto:${atob('dGhvbWFzLmFuc2FydEA=')}${atob('c3RpbHZhLmNvbQ==')}`;
}
