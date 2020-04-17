import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import clientComponents from '../../utils/clientComponents';
import clients from '../../clients';

import useOnScroll from "../../hooks/useOnScroll";
import useTransitionDirection from "../../hooks/useTransitionDirection";
import BackButton from "../../components/BackButton";

export default memo(function Client({dir, state, transitionstate, query : {clientId}}) {
  const data = clients.get(clientId);
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection(transitionstate);

  return  <div className={cx('client', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/client'} />
    <div className="content" style={{ top: `-${offset}px`}}>
      <h1 className="client-name">{data.label}</h1>
      {data.content.map((data, i) => {
        const props = {key: `content_${i}`, index: `${clientId}_${i}`, ...data};
        return createElement(clientComponents[data.type], props);
      })}
    </div>
  </div>
});
