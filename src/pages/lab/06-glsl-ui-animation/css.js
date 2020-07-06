export default `
.section__project canvas {
  max-height: 100%;
  max-width: 100%;
}

.column {
}

.section__project {

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
`;
