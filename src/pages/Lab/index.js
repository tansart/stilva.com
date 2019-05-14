import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import useOnScroll from '../../hooks/useOnScroll';

import BackButton from '../../components/BackButton';

import LabList from './LabList';
import LabEntry from './LabEntry';

export default memo(function Lab(props) {
  const scrollY = useOnScroll(props.transitionState, props.subCategory);

  return <div
    key={props.subCategory}
    className={cx('client', 'lab')}
    style={{transform: `translate3d(0,-${scrollY}px,0)`}}
  >
    <BackButton/>
    {props.subCategory ? <LabEntry labId={props.subCategory} />: <LabList />}
  </div>
});

export {
  LabList,
  LabEntry
}
