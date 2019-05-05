import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";
import { Link } from "@reach/router";

import clientComponents from '../../utils/clientComponents';

import data from '../../lab';

export default memo(function Lab({labId, locationKey}) {
  return <div className="content" key={locationKey}>
    <h1 className="client-name">Lab/{data[labId].title}</h1>
    <Link to="/lab">me</Link>
    {data[labId].content.map((data, i) => {
        const props = {key: `content_${i}`, index:i, ...data};
        return createElement(clientComponents[data.type], props);
      })}
  </div>
});
