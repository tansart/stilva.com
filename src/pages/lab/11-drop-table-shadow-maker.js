import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {css} from 'linaria';

import {Code} from '../../components';

export default memo(function () {
  return <>
    <h1>Drop-table-shadow maker</h1>
    <p>
      Here's a quick drop-table-shadow maker (or more like a table-box-shadow maker): many many nested tables so your email clients that don't support AMP-email,
      nor CSS <code>filter: drop-shadow(...);</code>, nor CSS <code>background: linear-gradient(...);</code>, and not even
      a basic support for <code>background: url(...) [no-repeat|repeat-x|repeat-y]);</code> – looking at you outlook 2007+
    </p>
    <p>
      This is far from perfect, since it's effectively doing a 9 slice scaling on the table.
    </p>
    <br />
    <DropTableShadow />
  </>
});

const dropshadowWrapperCSS = css`
  display: flex;
  flex-direction: row;
`;

const controlsCSS = css`
  display: flex;
  flex-direction: column;
`;

const sampleCSS = css`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  justify-content: center;
`;

function DropTableShadow({}) {
  const canvasRef = useRef();
  const [data, setData] = useState({
    offset_x: 4,
    offset_y: 4,
    opacity: .3,
    blur: 8,
    spread: 0,
    background: '#f1f1f1',
    color: '#000000'
  });
  const [html, setHtml] = useState('<table />');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.width = 400;
    canvas.height = 400;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.width;
    ctx.fillStyle = data.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Shadow
    ctx.shadowColor = data.color;
    ctx.shadowOffsetX = data.offset_x;
    ctx.shadowOffsetY = data.offset_y;
    ctx.shadowBlur = data.blur;
    ctx.fillStyle = `#f1f1f1${Math.round(data.opacity * 255).toString(16)}`;
    ctx.fillRect(100, 100, 100, 100);

    let gradientProperties = {
      xMin: -1,
      xMax: -1,
      yMin: -1,
      yMax: -1
    };

    // I'll need to find a more efficient way than this :|
    checkValue(gradientProperties, 'xMin', 'xMax', data.background,(i) => ctx.getImageData(i, 150 + data.offset_y, 1, 1));
    checkValue(gradientProperties, 'yMin', 'yMax', data.background, (i) => ctx.getImageData(150 + data.offset_x, i, 1, 1));

    setHtml(getHTML(gradientProperties, ctx));
  }, [data]);

  const onChangeFactory = (type, isInt = true) => e => {
    setData({
      ...data,
      [type]: isInt ? parseInt(e.target.value || 0, 10): e.target.value
    })
  };

  return <>
    <div className={dropshadowWrapperCSS}>
      <div className={controlsCSS}>
        <NumberInput label="Offset x" id="offset_x" defaultValue={4} onChange={onChangeFactory('offset_x')} />
        <br/>
        <NumberInput label="Offset y" id="offset_y" defaultValue={4} onChange={onChangeFactory('offset_y')} />
        <br/>
        <NumberInput label="Blur" id="blur" defaultValue={8} onChange={onChangeFactory('blur')} />
        <br/>
        <NumberInput label="Opacity" id="opacity" min={0} max={1} step={.01} defaultValue={.3} onChange={onChangeFactory('opacity')} />
        <br/>
        <ColourInput label="Background" id="background" defaultColour="#f1f1f1" onChange={onChangeFactory('background', false)} />
        <br/>
        <ColourInput label="Dropshadow colour" id="color" defaultColour="#000000" onChange={onChangeFactory('color', false)} />
        <br/>
      </div>
      <div className={sampleCSS} dangerouslySetInnerHTML={{__html: html}}/>
    </div>
    <br/>
    <Code lan="markup">{html}</Code>
  </>;
}

const inputWrapperCSS = css`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  justify-content: flex-start;
  width: 155px;
  
  label {
    flex: 1 0 auto;
  }
  
  input {
    flex: 0 0 auto;
  }
`;

function NumberInput({label, id, onChange, ...props}) {
  return <div className={inputWrapperCSS}>
    <label htmlFor={id}>
      {label}
    </label>
    : <input id={id} type="number" min={props.min || 0} max={props.max || 25} step={props.step || 1} defaultValue={props.defaultValue || 0} onChange={onChange} {...props} />
  </div>
}

function ColourInput({label, id, defaultColour, onChange}) {
  return <div className={inputWrapperCSS}>
    <label htmlFor={id}>
      {label}
    </label>
    : <input id={id} type="color" defaultValue={defaultColour} onChange={onChange} />
  </div>
}

function throttle(func, wait) {
  let waiting = false;
  let lastVal;
  return function ({target}) {
    if (!waiting) {
      waiting = true;
      func(target.value);
      setTimeout(() => {
        waiting = false;
        if (lastVal) func(lastVal);
      }, wait);
    } else {
      lastVal = target.value;
    }
  }
}

function getHTML({xMin, xMax, yMin, yMax}, ctx) {
  let out = `<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
  <tbody> 
`;
  const maxRow = 100 - yMin + yMax - 200 + 1;
  const maxCol = 100 - xMin + xMax - 200 + 1;
  const center = {r: Math.floor(maxRow / 2), c: Math.floor(maxCol / 2)};

  for(let r = 0; r < maxRow; r++) {
    out += `<tr>`;
    for(let c = 0; c < maxCol; c++) {
      if(r === center.r && c === center.c) {
        out += `

<td style="text-align:center; width: 200px;"> <br/> 🤠 <br/> &lt;table /&gt; wrangler <br/> &nbsp; </td>

`;
      } else {
        const x = c >= center.c ? 200 + c - center.c - 1: c + xMin;
        const y = r >= center.r ? 200 + r - center.r - 1: r + yMin;
        out += `<td style="background: #${toHex(ctx.getImageData(x,y,1,1).data)}; height: 1px; width: ${c === center.c ? 100: 1}px;"></td>`;
      }
    }
    out += `</tr>`
  }

  return `${out}
  </tbody>
</table>`;
}

function checkValue(gradientProperties, min, max, bg, getImageData) {
  for(let i = 0; i < 400; i++) {
    // let's skip the square itself
    if(i === 100) {
      i = 199;
      if(gradientProperties[min] < 0) {
        gradientProperties[min] = 100;
      }
      continue;
    }
    const hex = toHex(getImageData(i).data);
    if(gradientProperties[min] < 0 && `#${hex}` !== bg) {
      gradientProperties[min] = i;
      i = 199;
    }

    if(i >= 200 && gradientProperties[max] < 0 && `#${hex}` === bg) {
      gradientProperties[max] = i;
      break;
    }
  }
}

function toHex([r,g,b,a]) {
  return (r | 1 << 8).toString(16).slice(1) + (g | 1 << 8).toString(16).slice(1) + (b | 1 << 8).toString(16).slice(1);
}
