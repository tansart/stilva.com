import React, {memo} from 'react'; // eslint-disable-line no-unused-vars

import clients from '../../clients';
import CategoryLink from "../../components/CategoryLink";

export default memo(function ClientList({}) {
  const list = [];

  for(const k of clients.keys()) {
    list.push(<CategoryLink key={`client_title_${k}`} link={`/client/${k}`} label={clients.get(k).label} />);
  }

  return <div className="content">
    <div key="client-list">
      {list}
    </div>
  </div>
});

