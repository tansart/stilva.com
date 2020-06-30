import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import loadable from '@loadable/component'

import BasePage from "./BasePage";

const Lazy = loadable(({slug}) => import(`./work/${slug}`));

export default memo(function Work({transitionstate, query : {workId}}) {
  const props = {
    backPath: '/work',
    section:'work',
    transitionstate
  };

  return <BasePage
    {...props}
  >
    <Lazy slug={workId} transitionstate={transitionstate} />
  </BasePage>;
});
