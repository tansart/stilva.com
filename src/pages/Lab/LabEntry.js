import React, {memo, createElement, useContext} from 'react'; // eslint-disable-line no-unused-vars

import {RouterContext} from '../../RouterContext';

import clientComponents from '../../utils/clientComponents';
import AnimatedLink from '../../components/AnimatedLink';

import data from '../../lab';

export default memo(function Lab({labId}) {
  const {setRoute} = useContext(RouterContext);
  const onClick = e => {
    e.preventDefault();
    setRoute('/')
  };
  return <div className="content" key={labId}>
    <h1 className="client-name">
      <AnimatedLink link="/lab" label="Lab" /> {data[labId].title}
    </h1>
    {data[labId].content.map((data, i) => {
        const props = {key: `content_${i}`, index:i, ...data};
        return createElement(clientComponents[data.type], props);
      })}
  </div>
});
