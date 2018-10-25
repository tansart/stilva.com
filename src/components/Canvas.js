import {h, Component} from 'preact'; // eslint-disable-line no-unused-vars
import cx from 'classnames';
import Transition from 'preact-transition-group';

import RectangleAnimation from '../utils/RectangleAnimation';
import AnimationController from '../utils/AnimationController';

export default class Canvas extends Component {
	constructor(props) {
		super(props);
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

		const resolutionLocation = this.gl.getUniformLocation(program, "u_resolution");
		const numRectLocation = this.gl.getUniformLocation(program, "u_num_rectangle");

		function pGetImage(src) {
			const img = new Image();

			return new Promise(resolve => {
				img.addEventListener("load", _ => resolve(img));
				img.src = src
			});
		}

		let dTime = Date.now();
		let dTime2 = Date.now();

		this.projectTextureOne = createTexture(this.gl, program, 0, "u_image0");
		this.projectTextureTwo = createTexture(this.gl, program, 1, "u_image1");
		this.projectTextureThree = createTexture(this.gl, program, 2, "u_image2");

		const rect1 = new RectangleAnimation(.1, .1, .3, .4);
		rect1.animationProperties(1000, 0, false, 1);

		const rect2 = new RectangleAnimation(.5, .1, .5, .2);
		rect2.animationProperties(5000, 255, false, -1);

		const rect3 = new RectangleAnimation(.7, .4, .31, .3);
		rect3.animationProperties(750, 0, false, 1);

		const controller = new AnimationController();
		controller.addRectangle(rect1);
		controller.addRectangle(rect2);
		controller.addRectangle(rect3);

		setTimeout(_ => {
			if(rect2.time == 1) {
				rect2._time = 0;
			}

			rect2._cancelled = true;

			rect2.isHiding = true;
			rect2.output = null;
			controller.compile();
		}, 500);

		this.gl.uniform2fv(resolutionLocation, [window.innerWidth, window.innerHeight]);

		const render = () => {
			requestAnimationFrame(render);

			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

			dTime2 = Date.now();
			const arr = controller.get(parseFloat((dTime2 - dTime)/1000));
			dTime = dTime2;

			this.gl.uniform3fv(numRectLocation, [1., parseFloat(controller.length), parseFloat(controller.rectangles.length)]);

			this.projectTextureThree.apply(new ImageData(new Uint8ClampedArray(arr), 1, controller.length));
		};

		Promise.all([
			pGetImage("/dist/abstract-q-c-640-480-7.jpg"),
			pGetImage("/dist/abstract-q-c-640-480-8.jpg")
		]).then(([img, imgTwo]) => {
			const c = document.createElement("canvas");
			c.width = img.width;
			c.height = img.height;
			const ctxt = c.getContext('2d');
			ctxt.drawImage(img, 0, 0);

			this.projectTextureOne.apply(c);

			ctxt.drawImage(imgTwo, 0, 0);
			this.projectTextureTwo.apply(c);

			render();
		})
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
			
			float a = (step(pos.x, uv.x) - step(pos.x + size.x, uv.x));
			float b = (step(pos.y - size.y, uv.y) - step(pos.y, uv.y));
			
			return a * b;
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

	// maybe ?
	// const resolutionLocation = gl.getUniformLocation(program, `u_resolution_${index}`);
	// gl.uniform2fv(resolutionLocation, [window.innerWidth, window.innerHeight]);

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
