import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import data from '../../lab';
import parsingComponents from '../../utils/parsingComponents';
import useOnScroll from "../../hooks/useOnScroll";
import useTransitionDirection from "../../hooks/useTransitionDirection";
import BackButton from "../../components/BackButton";

export default memo(function Lab({query: {labId}, transitionstate}) {
  const offset = useOnScroll(transitionstate);
  const direction = useTransitionDirection(transitionstate);

  return <div className={cx('lab', 'page', `page--${transitionstate}`, direction)}>
    <BackButton path={'/lab'} />
    <div className="content" style={{ top: `-${offset}px`}}>
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
    </div>
  </div>
});
