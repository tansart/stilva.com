import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {css, cx} from 'linaria';

import {Code} from '../../components';

const strikethrough = css`
  text-decoration: line-through;
`;

export default memo(function () {
  return <>
    <h1>Drop-table-shadow maker</h1>
    <p>
      Here's a quick drop-table-shadow maker (or more like a table-box-shadow maker): many many nested tables for your email clients that don't support AMP-email,
      nor CSS <code>filter: drop-shadow(...);</code>, nor CSS <code>background: linear-gradient(...);</code>, and not even
      a basic support for <code>background: url(...) [no-repeat|repeat-x|repeat-y]);</code> – looking at you outlook 2007+
    </p>
    <p>
      <span className={strikethrough}>This is far from perfect, since it's effectively doing a 9 slice scaling on the table.</span>
      This is a very simplistic algorithm, where I use an HTML <code>&lt;Canvas /&gt;</code> to create a drop-shadow. I then read the pixels and create the HTML <code>&lt;table&gt;</code>
    </p>
    <br />
    <DropTableShadow />
  </>
});

const wrapperCSS = css`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const controlsCSS = css`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
`;

const sampleCSS = css`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  min-height: 290px;
  
  table {
    background: #f1f1f1;
  }
`;

const loaderCSS = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  justify-content: center;
  position: relative;
  margin: 0 auto 26px;
`;

function DropTableShadow({}) {
  const canvasRef = useRef();
  const node = useRef();
  const parser = useRef();
  const debounced = useCallback(debounce(250), []);
  const debouncedLong = useCallback(debounce(750), []);
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
  const [debouncedHtml, setDebouncedHtml] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvasRef.current = canvas;
    canvas.width = 400;
    canvas.height = 400;

    parser.current = new Parser(canvas.getContext('2d'));
    /*node.current.appendChild(canvas);
    return () => node.current.removeChild(canvas);*/
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.width;
    ctx.fillStyle = data.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Shadow
    ctx.shadowColor = `${data.color}${Math.round(data.opacity * 255).toString(16)}`;
    ctx.shadowOffsetX = data.offset_x;
    ctx.shadowOffsetY = data.offset_y;
    ctx.shadowBlur = data.blur;
    ctx.fillStyle = '#f1f1f1';
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

    debounced((...args) => {
      setHtml(parser.current.getHTML(...args));
    }, gradientProperties);
  }, [data, setHtml, parser]);

  useEffect(() => {
    debouncedLong(() => setDebouncedHtml(html))
  }, [data, html])

  const onChangeFactory = (type, apply = false) => e => {
    setData({
      ...data,
      [type]: apply ? apply(e.target.value || 0): e.target.value
    })
  };

  return <>
    <div className={wrapperCSS}>
      <div className={controlsCSS}>
        <NumberInput label="Offset x" id="offset_x" min={-50} max={50} defaultValue={4} onChange={onChangeFactory('offset_x', (value) => parseInt(value, 10))} />
        <br/>
        <NumberInput label="Offset y" id="offset_y" min={-50} max={50} defaultValue={4} onChange={onChangeFactory('offset_y', (value) => parseInt(value, 10))} />
        <br/>
        <NumberInput label="Blur" id="blur" defaultValue={8} onChange={onChangeFactory('blur', (value) => parseInt(value, 10))} />
        <br/>
        <NumberInput label="Opacity" id="opacity" min={0} max={1} step={.01} defaultValue={.3} onChange={onChangeFactory('opacity', (value) => parseFloat(value))} />
        <br/>
        <ColourInput label="Background" id="background" defaultColour="#f1f1f1" onChange={onChangeFactory('background', (value) => parseInt(value, 10))} />
        <br/>
        <ColourInput label="Dropshadow colour" id="color" defaultColour="#000000" onChange={onChangeFactory('color', (value) => parseInt(value, 10))} />
        <br/>
      </div>
      <div className={sampleCSS} style={{background: data.background}} dangerouslySetInnerHTML={{__html: html}}/>
    </div>
    <div ref={node} />
    <br/>
    <span className={loaderCSS} style={{visibility: html !== debouncedHtml ? 'visible': 'hidden'}}> waiting for the new html</span>
    <Code lan="markup">{debouncedHtml}</Code>
  </>;
}

const inputWrapperCSS = css`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  flex-direction: row;
  justify-content: flex-start;
  width: 218px;

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

function debounce(minDelay) {
  let timeout = null;
  let lastInvoked = -1;
  return (fn, ...args) => {
    const now = Date.now();
    clearTimeout(timeout);
    if(lastInvoked > 0 && now - lastInvoked > minDelay) {
      lastInvoked = -1;
      fn(...args);
    } else {
      timeout = setTimeout(() => {
        lastInvoked = -1;
        fn(...args);
      }, minDelay);
      lastInvoked = now;
    }
  };
}

const tableCSS = css`
  height: 250px;
  table-layout: fixed;
  width: 350px;
`;

class Parser {
  LEFT = 'left';
  RIGHT = 'right';
  UP = 'up';
  DOWN = 'down';

  constructor(ctx) {
    this._ctx = ctx;
  }

  getHTML = ({xMin, xMax, yMin, yMax}) => {
    let out = `<table border="0" class="${tableCSS}" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
  <tbody>
`;
    this.data = {
      gapL: Math.abs(100 - xMin),
      gapT: Math.abs(100 - yMin),
      gapR: Math.abs(200 - xMax),
      gapB: Math.abs(200 - yMax),
    };

    this.data.gapLeftRight = Math.max(this.data.gapL, this.data.gapR);
    this.data.gapTopBottom = Math.max(this.data.gapT, this.data.gapB);

    out += `
    <tr style="height: ${this.data.gapTopBottom}px">
        <td style="width: ${this.data.gapLeftRight}px;">
          ${this.getTable({
            x: 99,
            y: 99,
            xDir: this.LEFT,
            yDir: this.UP,
            w: this.data.gapL,
            h: this.data.gapT
          })}
        </td>
        <td style="width: 100%;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px; height: ${this.data.gapTopBottom}px; width: 100%;"><tbody><tr>
            <td>
              ${this.getTable({
                x: 100,
                y: 99,
                xDir: this.RIGHT,
                yDir: this.UP,
                w: this.data.gapLeftRight,
                h: this.data.gapT
              })}
            </td>
            <td style="vertical-align: bottom;width: 100%;">
              ${this.getTable({
                x: 150,
                y: 99,
                xDir: 0,
                yDir: this.UP,
                w: 1,
                h: this.data.gapT
              })}
            </td>
            <td>
              ${this.getTable({
                x: 200,
                y: 99,
                xDir: this.LEFT,
                yDir: this.UP,
                w: this.data.gapLeftRight,
                h: this.data.gapT
              })}
            </td>
          </tr></tbody></table>
        </td>
        <td style="width: ${this.data.gapLeftRight}px;">
          ${this.getTable({
            x: 201,
            y: 99,
            xDir: this.RIGHT,
            yDir: this.UP,
            w: this.data.gapR,
            h: this.data.gapT
          })}
        </td>
    </tr>
    <tr style="height: 100%">
      <td style="height: 100%;text-align: right;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;height: 100%; width: 100%;"><tbody>
            <tr><td>
              ${this.getTable({
                x: 99,
                y: 100,
                xDir: this.LEFT,
                yDir: this.DOWN,
                w: this.data.gapL,
                h: this.data.gapTopBottom
              })}
            </td></tr>
            <tr><td style="height: 100%;">
              ${this.getTable({
                x: 99,
                y: 150,
                xDir: this.LEFT,
                yDir: 0,
                w: this.data.gapL,
                h: 1
              })}
            </td></tr>
            <tr><td>
              ${this.getTable({
                x: 99,
                y: 200,
                xDir: this.LEFT,
                yDir: this.UP,
                w: this.data.gapL,
                h: this.data.gapTopBottom
              })}
            </td></tr>
          </tbody></table>
      </td>
      <td style="width: 100%; text-align: center;">
        table wrangler 🤠
      </td>
      <td style="height: 100%;text-align: left;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;height: 100%; width: 100%;"><tbody>
            <tr><td>
              ${this.getTable({
                x: 201,
                y: 100,
                xDir: this.RIGHT,
                yDir: this.DOWN,
                w: this.data.gapR,
                h: this.data.gapTopBottom
              })}
            </td></tr>
            <tr><td style="height: 100%;">
              ${this.getTable({
                x: 201,
                y: 150,
                xDir: this.RIGHT,
                yDir: 0,
                w: this.data.gapR,
                h: 1
              })}
            </td></tr>
            <tr><td>
              ${this.getTable({
                x: 201,
                y: 200,
                xDir: this.RIGHT,
                yDir: this.UP,
                w: this.data.gapR,
                h: this.data.gapTopBottom
              })}
            </td></tr>
          </tbody></table>
      </td>
    </tr>
    <tr style="height: ${this.data.gapTopBottom}px">
        <td style="width: ${this.data.gapLeftRight}px;">
          ${this.getTable({
            x: 99,
            y: 201,
            xDir: this.LEFT,
            yDir: this.DOWN,
            w: this.data.gapL,
            h: this.data.gapB
          })}
        </td>
        <td style="width: 100%;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;"><tbody><tr>
            <td>
              ${this.getTable({
                x: 100,
                y: 200,
                xDir: this.RIGHT,
                yDir: this.DOWN,
                w: this.data.gapLeftRight,
                h: this.data.gapB
              })}
            </td>
            <td style="vertical-align: top;width: 100%;">
              ${this.getTable({
                x: 150,
                y: 200,
                xDir: 0,
                yDir: this.DOWN,
                w: 1,
                h: this.data.gapB
              })}
            </td>
            <td>
              ${this.getTable({
                x: 200,
                y: 200,
                xDir: this.LEFT,
                yDir: this.DOWN,
                w: this.data.gapLeftRight,
                h: this.data.gapB
              })}
            </td>
          </tr></tbody></table>
        </td>
        <td style="width: ${this.data.gapLeftRight}px;">
          ${this.getTable({
            x: 200,
            y: 200,
            xDir: this.RIGHT,
            yDir: this.DOWN,
            w: this.data.gapR,
            h: this.data.gapB
          })}
        </td>
    </tr>
  `;

    return `${out}
  </tbody>
</table>`;
  }

  getTable({x, y, xDir, yDir, w, h}) {
    const isSide = xDir === 0 || yDir === 0;
    const fillX = w !== this.data.gapLeftRight;
    const fillY = h !== this.data.gapTopBottom;
    const tableW = isSide && fillX ? '100%': `${this.data.gapLeftRight}px`;
    const tableH = isSide && fillY ? '100%': `${this.data.gapTopBottom}px`;

    let out = `<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px; width: ${tableW}; height: ${tableH}; table-layout: fixed;"><tbody>`;
    for(let j = 0; j < h; j++) {
      const r = yDir === this.UP ? -1 * (h - j - 1): j;
      out += `<tr>`;
      for(let i = 0; i < w; i++) {
        const c = xDir === this.LEFT ? -1 * (w - i - 1): i;
        const cellW = this.data.gapLeftRight !== w && ((i === 0 && xDir === this.LEFT) || (i === w - 1 && xDir === this.RIGHT)) ? '100%': '1px';
        const cellH = this.data.gapTopBottom !== h && ((j === 0 && yDir === this.UP) || (j === h - 1 && yDir === this.UP)) ? '100%': '1px';
        out += `<td style="width: ${cellW}; height: ${cellH}; background: #${toHex(this._ctx.getImageData(x + c, y + r, 1, 1).data)};"></td>`;
      }
      out += `</tr>`;
    }

    return `${out}</tbody></table>`;
  }
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
