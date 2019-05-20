import React, {memo} from 'react'; // eslint-disable-line no-unused-vars
import cx from "classnames";

import useOnScroll from '../../hooks/useOnScroll';

import BackButton from '../../components/BackButton';

import ClientList from './ClientIndex';
import ClientEntry from './ClientEntry';

export default memo(function Client({subCategory, transitionState}) {
  const scrollY = useOnScroll(transitionState, subCategory);

  return <div
    key={subCategory}
    className={cx('client', 'lab')}
    style={{transform: `translate3d(0,-${scrollY}px,0)`}}
  >
    <BackButton/>
    {subCategory ? <ClientEntry clientId={subCategory} />: <ClientList />}
  </div>
});

export {
  ClientList,
  ClientEntry
};
