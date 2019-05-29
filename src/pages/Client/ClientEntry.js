import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import clientComponents from '../../utils/clientComponents';
import clients from '../../clients';

import useOnScroll from "../../hooks/useOnScroll";

export default memo(function Client({dir, state, clientId, transitionState}) {
  const data = clients.get(clientId);

  if(!data) {
    return <h1>out</h1>;
  }

  const scrollY = useOnScroll(transitionState, clientId);

  return  <div className={cx('content', 'page--right', `page--${state}`)}>
    <h1 className="client-name">{data.label}</h1>
    {data.content.map((data, i) => {
      const props = {key: `content_${i}`, index:i, ...data};
      return createElement(clientComponents[data.type], props);
    })}
  </div>
});
