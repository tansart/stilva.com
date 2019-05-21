import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars

import clientComponents from '../../utils/clientComponents';
import clients from '../../clients';

import useOnScroll from "../../hooks/useOnScroll";

export default memo(function Client(props) {
  const data = clients.get(props.clientId);

  const scrollY = useOnScroll(props.transitionState, props.clientId);

  return  <div className="content">
    <h1 className="client-name">{data.label}</h1>
    {data.content.map((data, i) => {
      const props = {key: `content_${i}`, index:i, ...data};
      return createElement(clientComponents[data.type], props);
    })}
  </div>
});
