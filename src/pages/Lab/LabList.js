import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";
import {Link} from '../../utils/TransitionableRoute';

import data from '../../lab';

export default memo(function LabList(props) {
  return <div className="content">
    <div key={props.subCategory}>
      {Object.keys(data)
        .map(k => {
          return <Link key={`title_${k}`} path={`/lab/${k}`}>
            {data[k].title}
          </Link>
        })
      }
    </div>
  </div>
});
