import React, {memo} from 'react'; // eslint-disable-line no-unused-vars

import BasePage from './BasePage';
import CategoryLink from "../components/CategoryLink";
import work from '../work';

export default memo(function WorkList({transitionstate}) {
  const list = [];

  for(const k of work.keys()) {
    list.push(<CategoryLink key={`work_title_${k}`} link={`/work/${k}`} label={work.get(k).label} />);
  }

  const props = {
    backPath: '/',
    isList: true,
    section:'work',
    transitionstate
  };

  return <BasePage
    {...props}
  >
    <div key="work-list">
      {list}
    </div>
  </BasePage>
});
