import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";
import {Link} from '../../utils/TransitionableRoute';

import data from '../../lab';
import CategoryLink from "../../components/CategoryLink";

export default memo(function LabList(props) {
  return <div className="content">
    <div key={props.subCategory}>
      {Object.keys(data)
        .map(k =>
          <CategoryLink key={`title_${k}`} link={`/lab/${k}`} label={data[k].title} />
        )
      }
    </div>
  </div>
});
