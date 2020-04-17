import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import clients from '../../clients';
import CategoryLink from "../../components/CategoryLink";

import useOnScroll from "../../hooks/useOnScroll";
import useTransitionDirection from "../../hooks/useTransitionDirection";
import BackButton from "../../components/BackButton";

export default memo(function ClientList({dir, transitionstate}) {
  const list = [];
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection(transitionstate);

  for(const k of clients.keys()) {
    list.push(<CategoryLink key={`client_title_${k}`} link={`/client/${k}`} label={clients.get(k).label} />);
  }

  return  <div className={cx('client', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/'} />
    <div className="content" style={{ top: `-${offset}px`}}>
      <div key="client-list">
        {list}
      </div>
    </div>
  </div>
});

