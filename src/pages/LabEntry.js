import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars

import BasePage from "./BasePage";
import data from '../lab';
import parsingComponents from '../utils/parsingComponents';

export default memo(function Lab({query: {labId}, transitionstate}) {
  const props = {
    backPath: '/lab',
    isEntry: true,
    section:'lab',
    transitionstate
  };

  return <BasePage
    {...props}
  >
    <h1 className="work-name">{data[labId].title}</h1>
    {data[labId].content.map((data, i) => {
      const props = {
        ...data,
        key: `content_${i}`,
        index: `${labId}_${i}`,
        transitionstate
      };
      if(data.type === 'FunctionalComponent') {
        const css = data.css && <style dangerouslySetInnerHTML={{__html: data.css}}/>;
        return <div key={`content_css_${i}`} className="custom-component">
          {css}
          {createElement(data.component, props)}
        </div>
      }
      return createElement(parsingComponents[data.type], props);
    })}
  </BasePage>;
});
