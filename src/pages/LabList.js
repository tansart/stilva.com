import React, {memo, useEffect} from 'react'; // eslint-disable-line no-unused-vars

import BasePage from "./BasePage";
import CategoryLink from "../components/CategoryLink";
import lab from '../lab';

import {StyleTransferHelper} from './lab/10-real-time-style-transfer-with-tensorflowjs/tf.facemesh'
import {pGetImage} from "./lab/10-real-time-style-transfer-with-tensorflowjs/utils";

export default memo(function LabList({transitionstate}) {
  const props = {
    backPath: '/',
    isList: true,
    section: 'lab',
    transitionstate
  };

  useEffect(() => {
    test();
  }, []);

  const list = [];

  for(const k of lab.keys()) {
    list.push(<CategoryLink key={`lab_title_${k}`} link={`/lab/${k}`} label={lab.get(k).label} />);
  }

  return <BasePage
    {...props}
  >
    {list}
  </BasePage>;
});

async function test() {
  const styleTransferHelper = new StyleTransferHelper(false);
  styleTransferHelper._cx = 0;
  styleTransferHelper._cy = 0;
  await styleTransferHelper.init(224, 224);

  const styles = [
    '/assets/adain/images/style_01.png',
    '/assets/adain/images/style_02.png',
    '/assets/adain/images/style_03.png',
    '/assets/adain/images/style_04.png',
    '/assets/adain/images/style_05.png',
    '/assets/adain/images/style_06.png',
    '/assets/adain/images/style_07.png',
  ];

  const contents = [
    '/assets/224/image-1.jpg',
    '/assets/224/image-2.jpg',
    '/assets/224/image-3.jpg',
    '/assets/224/image-4.jpg',
    '/assets/224/image-5.jpg',
    '/assets/224/image-6.jpg',
  ];

  styles.reduce((p, style) => {
    return p.then(async () => {
      await styleTransferHelper.setStyle(style);
      const wrapper = document.createElement('div');
      wrapper.style.height = '224px';
      document.body.appendChild(wrapper);
      return await contents.reduce((p, content) => {
        return p.then(async () => {
          await run(styleTransferHelper, wrapper, content);
        })
      }, Promise.resolve())
    })
  }, Promise.resolve());

  /*styles.forEach(async (styleURL) => {
    const wrapper = document.createElement('div');
    await styleTransferHelper.setStyle(styleURL);
    contents.forEach((contentURL) => {

    })
  })*/
}

async function run(styleTransferHelper, wrapper, contentURL) {
  const c = document.createElement('canvas');
  wrapper.append(c);
  c.width = 224;
  c.height = 224;

  const img = await pGetImage(contentURL);
  await styleTransferHelper._croppedContext.drawImage(img, 0, 0);
  await styleTransferHelper.applyStyletransfer();

  c.getContext('2d').drawImage(styleTransferHelper._faceCanvas, 0, 0);
}
