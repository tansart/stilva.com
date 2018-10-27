import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars
import cx from 'classnames';
import Transition from 'preact-transition-group';

import RectangleAnimation from '../utils/RectangleAnimation';
import AnimationController from '../utils/AnimationController';

const IMGS = [
	'/dist/abstract-q-c-640-480-6.jpg',
	'/dist/abstract-q-c-640-480-7.jpg',
	'/dist/abstract-q-c-640-480-8.jpg',
	'/dist/abstract-q-c-640-480-9.jpg',
	'/dist/abstract-q-c-640-480-6.jpg',
	'/dist/abstract-q-c-640-480-7.jpg',
	'/dist/abstract-q-c-640-480-8.jpg',
	'/dist/abstract-q-c-640-480-9.jpg',
	'/dist/abstract-q-c-640-480-6.jpg',
	'/dist/abstract-q-c-640-480-7.jpg'
];

export default class Canvas extends Component {
	constructor(props) {
		super(props);

		this.controller = new AnimationController();
	}

	componentWillReceiveProps(newProps) {
		// console.log(newProps.projectId > -1 ? IMGS[newProps.projectId]: '');

		if(newProps.projectId == -1) {
			this.controller.rectangles.forEach(r => {
				r._isHiding = true;
				r.output = null;
			});

			this.controller.compile();

			return null;
		}

		if (this.controller.output.length === 0) {

			pGetImage(IMGS[newProps.projectId])
					.then(img => this.projectTextureOne.apply(img))
					.then(_ => {

						for (let i = 0; i < 5; i++) {
							const rect = new RectangleAnimation(Math.random(), Math.random(), clamp(.2, .4), clamp(.2, .4));
							rect.animationProperties(0, 0, false, 1);
							this.controller.addRectangle(rect)
						}
					});
		} else {

			pGetImage(IMGS[newProps.projectId])
					.then(img => this.projectTextureTwo.apply(img))
					.then(_ => {

						for (let i = 0; i < 5; i++) {
							const rect = new RectangleAnimation(Math.random(), Math.random(), clamp(.2, .4), clamp(.2, .4));
							rect.animationProperties(0, 1, false, -1);
							this.controller.addRectangle(rect)
						}
					});
		}

		function clamp(min, max) {
			return max * Math.random() + min
		}
	}

	shouldComponentUpdate() {
		return false;
	}

	componentDidMount() {
		this.gl = this.node.getContext('webgl', {antialias: false});

		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

		const {vertex, fragment} = getShaders();

		const program = setupProgram(this.gl, vertex, fragment);

		const positionLocation = this.gl.getAttribLocation(program, "a_position");
		this.gl.enableVertexAttribArray(positionLocation);
		this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

		const timeLocation = this.gl.getUniformLocation(program, "u_time");
		const resolutionLocation = this.gl.getUniformLocation(program, "u_resolution");
		const numRectLocation = this.gl.getUniformLocation(program, "u_num_rectangle");

		this.projectTextureOne = createTexture(this.gl, program, 0, "u_image0");
		this.projectTextureTwo = createTexture(this.gl, program, 1, "u_image1");
		this.projectTextureThree = createTexture(this.gl, program, 2, "u_image2");

		let timeDelta = 0;

		this._dTime = Date.now();
		this._dTime2 = Date.now();

		this.gl.uniform2fv(resolutionLocation, [window.innerWidth, window.innerHeight]);

		this.render = () => {
			// if(this.controller.output.length > 0) {
				requestAnimationFrame(this.render);
			// }

			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

			this._dTime2 = Date.now();
			timeDelta = parseFloat((this._dTime2 - this._dTime)/1000);
			const arr = this.controller.get(timeDelta);
			this._dTime = this._dTime2;

			this.gl.uniform1f(timeLocation, timeDelta);
			this.gl.uniform3fv(numRectLocation, [1., parseFloat(this.controller.length), parseFloat(this.controller.rectangles.length)]);

			this.projectTextureThree.apply(new ImageData(new Uint8ClampedArray(arr), 1, this.controller.length));
		};

		this.render();
	}

	render(props) {
		return <canvas ref={node => this.node = node} className='hero-bg-canvas' width={window.innerWidth} height={window.innerHeight}/>
	}
}

function getShaders() {
	const vertex = `
		attribute vec2 a_position;
		void main() {
			gl_Position = vec4(a_position, 0, 1);
		}`;

	const fragment = `
		precision mediump float;
		
		uniform sampler2D u_image0;
		uniform sampler2D u_image1;
		uniform sampler2D u_image2;
		
		uniform vec2 u_resolution;
		uniform vec3 u_num_rectangle;
		
		uniform float u_time;
		
		float rectangle(vec2 uv, vec2 pos, vec2 size) {
			pos = vec2(pos.x, 1. - pos.y);
			
			return (step(pos.x, uv.x) - step(pos.x + size.x, uv.x))
				* (step(pos.y - size.y, uv.y) - step(pos.y, uv.y));
		}
		
		float uniformNoise(vec2 n) {
			return fract(sin(dot(n, vec2(12.9898, 78.233))) * 43758.5453);
		}
		
		float noise(vec2 p) {
			// return uniformNoise(vec2(sin(u_time * p.x * .5), cos(u_time) * .8 * p.y ));
			float t = fract( u_time );

			float nrnd0 = uniformNoise( p + 0.07*t );
			float nrnd1 = uniformNoise( p + 0.11*t );	
			float nrnd2 = uniformNoise( p + 0.13*t );
			float nrnd3 = uniformNoise( p + 0.17*t );
			
			float nrnd4 = uniformNoise( p + 0.19*t );
			float nrnd5 = uniformNoise( p + 0.23*t );
			float nrnd6 = uniformNoise( p + 0.29*t );
			float nrnd7 = uniformNoise( p + 0.31*t );
			
			return (nrnd0+nrnd1+nrnd2+nrnd3 +nrnd4+nrnd5+nrnd6+nrnd7) / 8.0;
		}

		vec4 readPixel(vec2 pos) {
			return texture2D(u_image2, (pos + .5)/u_num_rectangle.xy);
		}
		
		// x, y, w, h,
		vec4 getPositions(float rect_num) {
			return vec4(
				readPixel(vec2(1.0, 8. * rect_num)).a,
				readPixel(vec2(1.0, 8. * rect_num + 1.)).a,
				readPixel(vec2(1.0, 8. * rect_num + 2.)).a,
				readPixel(vec2(1.0, 8. * rect_num + 3.)).a
			);
		}
		
		// animation direction, t animation time (0 -> 1), show/hide, which texture
		vec4 getAnimationDetails(float rect_num) {
			return vec4(
				readPixel(vec2(1.0, 8. * rect_num + 4.)).a,
				readPixel(vec2(1.0, 8. * rect_num + 5.)).a,
				readPixel(vec2(1.0, 8. * rect_num + 6.)).a,
				readPixel(vec2(1.0, 8. * rect_num + 7.)).a
			);
		}
		
		void main() {
			
			vec2 uv = gl_FragCoord.xy/u_resolution.xy;
			
			vec4 textureOne = texture2D(u_image0, uv);
			vec4 textureTwo = texture2D(u_image1, uv);
			
			// x, y, w, h,
			// which texture, timing, is hiding animation, animation direction
			
			// sets the background colour
			gl_FragColor = vec4(1., 1., 1., 1.);
			
			for(float i = 0.; i <= 100.; i++) {
				if(i == u_num_rectangle.z) break;

				vec4 pos = getPositions(i);
				vec4 anim = getAnimationDetails(i);
				
				float w = pos.b * anim.y;
				
				// if hide is true
				if(anim.z == 1.) {
					w = pos.b * (1. - anim.y);
				}
				
				float x = pos.r;
				
				if(anim.w == 0.) {
					x = pos.r + pos.b - w;
				}
				
				vec4 texture = textureOne;
				
				if(anim.x > 0.) {
					texture = textureTwo;
				}
				
				gl_FragColor = mix(gl_FragColor, texture, rectangle(uv, vec2(x, pos.g), vec2(w, pos.a)));
			}

			gl_FragColor += noise(uv)/4.;
		}`;

	return {vertex, fragment};
}

function createTexture(gl, program, index, name) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	gl.uniform1i(gl.getUniformLocation(program, name), index);

	const textureID = gl[`TEXTURE${index}`];

	gl.activeTexture(textureID);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(2,2));

	return {
		apply: (source) => {
			gl.activeTexture(textureID);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
		},
		texture
	};
}

function setupProgram(gl, vertex, fragment) {
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([
				-1.0, -1.0,
				1.0, -1.0,
				-1.0,  1.0,
				-1.0,  1.0,
				1.0, -1.0,
				1.0,  1.0]),
			gl.STATIC_DRAW
	);

	const vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader, vertex);
	gl.compileShader(vertexShader);

	const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader, fragment);
	gl.compileShader(fragmentShader);

	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	gl.useProgram(program);

	return program;
}

function pGetImage(src) {
	const img = new Image();

	return new Promise(resolve => {
		img.addEventListener("load", _ => resolve(img));
		img.src = src
	});
}
