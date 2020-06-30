import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import loadable from '@loadable/component'

import BasePage from "./BasePage";

const Lazy = loadable(({slug}) => import(`./lab/${slug}`));

export default memo(function Lab({transitionstate, query : {labId}}) {
  const props = {
    backPath: '/lab',
    section:'lab',
    transitionstate
  };

  return <BasePage
    {...props}
  >
    <Lazy slug={labId} transitionstate={transitionstate} />
  </BasePage>;
});
