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
		this.gl = this.node.getContext('webgl');

		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

		const {vertex, fragment} = getShaders();

		const program = setupProgram(this.gl, vertex, fragment);

		const positionLocation = this.gl.getAttribLocation(program, "a_position");
		this.gl.enableVertexAttribArray(positionLocation);
		this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

		const resolutionLocation = this.gl.getUniformLocation(program, "u_resolution");
		const timeLocation = this.gl.getUniformLocation(program, "u_time");
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

		const rect1 = new RectangleAnimation(0., 0., .3, .3);
		rect1.animationProperties(0, true, 1);

		const rect2 = new RectangleAnimation(.2, .2, .3, .3);
		rect2.animationProperties(0, false, 1);

		const rect3 = new RectangleAnimation(.7, .4, .3, .3);
		rect3.animationProperties(0, true, 1);

		const controller = new AnimationController();
		controller.addRectangle(rect1);
		setTimeout(_ => {
			controller.addRectangle(rect2);
		}, 1000);
		setTimeout(_ => {
			controller.addRectangle(rect3);
		}, 1500);


		const render = () => {
			requestAnimationFrame(render);

			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

			this.gl.uniform2fv(resolutionLocation, [window.innerWidth, window.innerHeight]);
			this.gl.uniform3fv(numRectLocation, [1., parseFloat(controller.length), 2.]);
			// this.gl.uniform1f(timeLocation, parseFloat((Date.now() - dTime)/1000));

			dTime2 = Date.now();
			const arr = controller.get(parseFloat((dTime2 - dTime)/1000));
			dTime = dTime2;

			this.projectTextureThree.apply(new ImageData(new Uint8ClampedArray(arr), 1, controller.length));
		};

		render();

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
		
		float rectangle2(vec2 uv, vec2 pos, vec2 size) {
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
			return readPixel(vec2(1.0, 2. * rect_num));
		}
		
		// animation direction, t animation time (0 -> 1), show/hide, which texture
		vec4 getAnimationDetails(float rect_num) {
			return readPixel(vec2(1.0, 2. * rect_num + 1.0));
		}
		
		void main() {
			
			vec2 uv = gl_FragCoord.xy/u_resolution.xy;
			
			vec4 textureOne = texture2D(u_image0, uv);
			vec4 textureTwo = texture2D(u_image1, uv);
			
			// x, y, w, h,
			// animation direction, show/hide, which texture, N/A
			
			// sets the background colour
			gl_FragColor = vec4(1., 1., 1., 1.);
			
			for(float i = 0.; i <= 100.; i++) {
				vec4 pos = getPositions(i);
				vec4 anim = getAnimationDetails(i);
				
				/*
				1 - ratio == -1 * (-1 + ratio)
				ratio
				
				float step(float edge, float x) => 0 if x < edge & 1 otherwise
				*/
				
				float w = pos.b * .5;// * anim.y;
				gl_FragColor = mix(gl_FragColor, textureOne, rectangle2(uv, pos.rg, vec2(w, pos.a)));
				
				if(i >= u_num_rectangle.z) break;
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
