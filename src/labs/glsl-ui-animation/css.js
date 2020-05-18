export default `
.wrapper {
  align-items: center;
  background: #1D1D1D;
  display: flex;
  height: ${Math.round(900/1440 * 800)}px;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden;
  position: relative;
  width: 800px;
}

.section__project canvas {
  max-height: 100%;
  max-width: 100%;
}

.column {
  background: #FFFAF5;
  cursor: pointer;
  display: block;
  flex: 0 0 auto;
  height: 40%;
  margin: 0;
  position: absolute;
  width: 20%;
}

.section__project {
  --translateXY: 0;
  --scale: 0;
  left: 0;
  margin: 24px auto 0;
  overflow: hidden;
  position: relative;
  top: 0;
  white-space: nowrap;
  z-index: 1;
}

.section__project canvas {
  pointer-events: none;
}

.section__project .glsl__content {
  z-index: 1;
}

.section__project-content {
  background: #FFFAF5;
  display: block;
  left: 0;
  position: absolute;
  top: 0;
  transform: translate3d(var(--translateXY), 0) scale(var(--scale));
  transform-origin: 0% 0%;
}

.section__text {
  background: black;
  display: block;
  height: 15px;
  left: 15px;
  pointer-events: none;
  position: relative;
  top: 15px
}

.button__close {
  align-items: center;
  background: #1d1d1d;
  display: flex;
  height: 10%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
}

.button__close button {
  background: transparent;
}

.glsl__content img {
  top: 30%;
  display: block;
  left: 50%;
  opacity: 0;
  position: absolute;
  pointer-events: none;
  transform: translate3d(-50%, 0, 0);
}

.gl.glsl__content img {
  opacity: 1;
}

.glsl__content span {
  color: transparent;
  display: block;
  font-family: MaisonNeue-Book;
  font-size: 94px;
  font-style: normal;
  font-weight: normal;
  line-height: 1.25;
  max-width: 100%;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  top: 75px;
  white-space: normal;
}

.gl.glsl__content span {
  color: black;
}
`;
