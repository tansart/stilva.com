import React, {memo, createElement} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import useOnScroll from '../../hooks/useOnScroll';

import BackButton from '../../components/BackButton';

import LabList from './LabList';
import LabEntry from './LabEntry';

export default memo(function Lab(props) {
  const scrollY = useOnScroll(props.transitionState, props.locationKey);

  return <div
    key={props.locationKey}
    className={cx('client', 'lab')}
    style={{transform: `translate3d(0,-${scrollY}px,0)`}}
  >
    <BackButton/>
    {props.children}
  </div>
});

export {
  LabList,
  LabEntry
}
