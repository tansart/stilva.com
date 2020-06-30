import React, {memo} from 'react'; // eslint-disable-line no-unused-vars

import BasePage from "./BasePage";
import CategoryLink from "../components/CategoryLink";
import lab from '../lab';

export default memo(function LabList({transitionstate}) {
  const props = {
    backPath: '/',
    isList: true,
    section: 'lab',
    transitionstate
  };

  const list = [];

  for(const k of lab.keys()) {
    list.push(<CategoryLink key={`lab_title_${k}`} link={`/lab/${k}`} label={lab.get(k).label} />);
  }

  return <BasePage
    {...props}
  >
    {list}
  </BasePage>;
});
