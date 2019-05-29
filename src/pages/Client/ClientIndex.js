import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import clients from '../../clients';
import CategoryLink from "../../components/CategoryLink";

export default memo(function ClientList({dir, transitionState}) {
  const list = [];

  for(const k of clients.keys()) {
    list.push(<CategoryLink key={`client_title_${k}`} link={`/client/${k}`} label={clients.get(k).label} />);
  }

  return  <div className={cx('content', 'page--right', `page--${transitionState}`)}>
    <div key="client-list">
      {list}
    </div>
  </div>
});

