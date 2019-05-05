import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";
import { Link } from "@reach/router";

import data from '../../lab';

export default memo(function LabList(props) {

  return <div key={props.locationKey}>
    {Object.keys(data)
      .map(k => {
        return <Link key={`title_${k}`} to={`/lab/${k}`}>
          {data[k].title}
        </Link>
      })
    }
  </div>
});
