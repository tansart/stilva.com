import React, {memo} from 'react'; // eslint-disable-line no-unused-vars

import data from '../lab';
import CategoryLink from "../components/CategoryLink";
import BasePage from "./BasePage";

export default memo(function LabList({transitionstate}) {
  const props = {
    backPath: '/',
    isList: true,
    section: 'lab',
    transitionstate
  };

  return <BasePage
    {...props}
  >
    {Object.keys(data)
      .map(k =>
        <CategoryLink key={`title_${k}`} link={`/lab/${k}`} label={`${data[k].title}`}/>
      )
    }
  </BasePage>;
});
