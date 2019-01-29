import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import clientComponents from '../utils/clientComponents';
import clients from '../clients';

import BackButton from '../components/BackButton';
import useOnScroll from "../hooks/useOnScroll";

export default memo(function Client(props) {
  const data = clients.get(props.clientId);

  const scrollY = useOnScroll(props.transitionState, props.locationKey);

  return <div
    className={cx('client', 'page')}
    style={{transform: `translate3d(0,-${scrollY}px,0)`}}
  >
    <BackButton/>

    <div className="content">
      <h1 className="client-name">{data.label}</h1>
      {data.content.map((data, i) => {
        const props = {key: `content_${i}`, ...data};
        return createElement(clientComponents[data.type], props);
      })}
    </div>
  </div>
});
