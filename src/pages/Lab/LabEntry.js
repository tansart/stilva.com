import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";
import { Link } from "../../utils/TransitionableRoute";

import clientComponents from '../../utils/clientComponents';

import data from '../../lab';

export default memo(function Lab({labId}) {
  console.log(data, labId)
  return <div className="content" key={labId}>
    <h1 className="client-name">Lab/{data[labId].title}</h1>
    <Link path="/lab">me</Link>
    {data[labId].content.map((data, i) => {
        const props = {key: `content_${i}`, index:i, ...data};
        return createElement(clientComponents[data.type], props);
      })}
  </div>
});
