import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars
import cx from 'classnames';
import Transition from 'preact-transition-group';

import RectangleAnimation from '../utils/RectangleAnimation';
import DragController from '../utils/DragController';

export default class Canvas extends Component {
	constructor(props) {
		super(props);

		this.kill = false;

		this.controller = new DragController();
	}

	shouldComponentUpdate() {
		return false;
	}

	componentWillUnmount() {
		this.kill = true;
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
		let windowInnerWidth = window.innerWidth * .8;

		this._dTime = Date.now();
		this._dTime2 = Date.now();

		this.render = () => {
			if (!this.kill) {
				requestAnimationFrame(this.render);
			}

			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

			this._dTime2 = Date.now();
			timeDelta = parseFloat((this._dTime2 - this._dTime) / 1000);
			this._dTime = this._dTime2;

			const arr = this.controller.get(this.props.dist);

			windowInnerWidth = .8 * window.innerWidth;
			this.gl.uniform1f(timeLocation, timeDelta);
			this.gl.uniform2fv(resolutionLocation, [windowInnerWidth, windowInnerWidth / (640 / 480)]);

			this.gl.uniform3fv(numRectLocation, [1., parseFloat(this.controller.length), parseFloat(this.controller.rectangles.length)]);
			this.projectTextureThree.apply(new ImageData(new Uint8ClampedArray(arr), 1, this.controller.length));
		};

		pGetImage('/dist/abstract-q-c-640-480-8.jpg')
				.then(img => this.projectTextureTwo.apply(img))
				.then(_ => {
					const max = 5;
					for(let i = 0; i < max; i++) {
						let rect = new RectangleAnimation(0., 1/max*i, 1., 1/max);
						rect.animationProperties(500 + 250 * i, 0, false, (i%2+.5)*2-2);
						this.controller.addRectangle(rect, 0);
					}
				});

		pGetImage('/dist/abstract-q-c-640-480-9.jpg')
				.then(img => this.projectTextureOne.apply(img))
				.then(_ => {
					const max = 4;
					for(let i = 0; i < max; i++) {
						let rect = new RectangleAnimation(0., 1/max*i, 1., 1/max);
						rect.animationProperties(500 + 250 * i, 1, false, (i%2+.5)*2-2);
						this.controller.addRectangle(rect, 0);
					}
				});

		this.render();
	}

	render(props) {
		const width = window.innerWidth * .8;

		return <canvas ref={node => this.node = node} className='project-bg-canvas' width={width}
									 height={width / (640 / 480)} />
	}
}

function getShaders() {
	const vertex = `
		attribute vec2 a_position;
		void main() {
			gl_Position = vec4(a_position, 0, 1);
		}`;

	const fragment = `
		precision highp float;
		
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
			// return fract(sin(dot(n, vec2(12.9898, 78.233))) * 43758.5453);
			return fract(4096.0 * sin(dot(n, vec2(12.0, 59.0))));
		}
		
		float noise(vec2 p) {
			// return uniformNoise(vec2(cos(u_time * p.x * .5), cos(u_time) * .8 * p.y ));
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
			vec2 flippedUV = vec2(uv.x, 1. - uv.y);
			
			vec4 textureOne = texture2D(u_image0, flippedUV);
			vec4 textureTwo = texture2D(u_image1, flippedUV);
			
			// x, y, w, h,
			// which texture, timing, is hiding animation, animation direction
			
			// sets the background colour
			gl_FragColor = vec4(0., 0., 0., 0.);
			
			for(float i = 0.; i <= 100.; i++) {
				if(i == u_num_rectangle.z) break;

				vec4 pos = getPositions(i);
				vec4 anim = getAnimationDetails(i);
				
				vec4 texture = textureOne;
				
				float t = anim.y;
				
				if(anim.x > 0.) {
					texture = textureTwo;
				}
				
				if(t < .0) {
					t = -1.;
				}
				
				float w = pos.b * t;
				
				// if hide is true
				if(anim.z == 1.) {
					w = pos.b * (1. - t);
				}
				
				float x = pos.r;
				
				if(anim.w == 0.) {
					x = pos.r + pos.b - w;
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
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

	gl.uniform1i(gl.getUniformLocation(program, name), index);

	const textureID = gl[`TEXTURE${index}`];

	gl.activeTexture(textureID);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(2, 2));

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
				-1.0, 1.0,
				-1.0, 1.0,
				1.0, -1.0,
				1.0, 1.0
			]), gl.STATIC_DRAW
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
