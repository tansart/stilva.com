import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import loadable from '@loadable/component'

import lab from '../lab';
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
    <Lazy slug={`${('' + lab.get(labId).index).padStart(2, '0')}-${labId}`} transitionstate={transitionstate} />
  </BasePage>;
});
