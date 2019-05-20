import React, {memo} from 'react'; // eslint-disable-line no-unused-vars

import data from '../../lab';
import CategoryLink from "../../components/CategoryLink";

export default memo(function LabList(props) {
  return <div className="content">
    <div key="lab-list">
      {Object.keys(data)
        .map(k =>
          <CategoryLink key={`title_${k}`} link={`/lab/${k}`} label={data[k].title} />
        )
      }
    </div>
  </div>
});
