import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import loadable from '@loadable/component'

import BasePage from "./BasePage";
// import work from '../../work';
const Lazy = loadable(({slug}) => import(`./work/${slug}`));

export default memo(function Work({dir, state, transitionstate, query : {workId}}) {
  // const data = work.get(workId);

  const props = {
    backPath: '/work',
    section:'work',
    transitionstate
  };

  return <BasePage
    {...props}
  >
    <Lazy slug={workId} transitionstate={transitionstate} />
    {/*<h1 className="work-name">{data.label}</h1>
    {data.content.map((data, i) => {
      const props = {key: `content_${i}`, index: `${workId}_${i}`, ...data};
      return createElement(parsingComponents[data.type], props);
    })}*/}
  </BasePage>;
});
