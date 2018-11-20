import React, {Component} from 'react'; // eslint-disable-line no-unused-vars

import RectangleAnimation from '../utils/RectangleAnimation';
import DragController from '../utils/DragController';

export default class Canvas extends Component {
	constructor(props) {
		super(props);

		this.maxRects = 5;

		this.kill = false;

		this.controller = new DragController();
	}

	shouldComponentUpdate(nextProps, nextState) {
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
		this.projectMatrix = createTexture(this.gl, program, 3, "u_image3");

		let initTime = Date.now();
		let windowInnerWidth = window.innerWidth * .8;

		this.render = () => {
			if (!this.kill) {
				requestAnimationFrame(this.render);
			}

			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

			const arr = this.controller.get(this.props.dist);

			windowInnerWidth = .8 * window.innerWidth;
			this.gl.uniform1f(timeLocation, Date.now() - initTime);
			this.gl.uniform2fv(resolutionLocation, [windowInnerWidth, windowInnerWidth / (640 / 480)]);

			this.gl.uniform3fv(numRectLocation, [1., parseFloat(this.controller.length), parseFloat(this.controller.rectangles.length)]);
			this.projectMatrix.apply(new ImageData(new Uint8ClampedArray(arr), 1, this.controller.length));
		};

		const [prev, curr, next] = this.props.getPrevNext(this.props.projectList, this.props.projectId);

		const img = new Image();
		img.src = curr[1].heroImage;
		this.projectTextureOne.apply(img);
		let rect = new RectangleAnimation(0., 0., 1., 1.);
		rect.animationProperties(0, 0, false, 1);
		this.controller.addRectangle(rect, 0);

		pGetImage(prev[1].heroImage)
				.then(img => this.projectTextureTwo.apply(img))
				.then(_ => {
					for(let i = 0; i < this.maxRects; i++) {
						let rect = new RectangleAnimation(0., 1/this.maxRects*i, 1., 1/this.maxRects);
						rect.animationProperties(this.maxRects-i, 1, false, -1);
						this.controller.addRectangle(rect, 0);
					}
				});

		pGetImage(next[1].heroImage)
				.then(img => this.projectTextureThree.apply(img))
				.then(_ => {
					for(let i = 0; i < this.maxRects; i++) {
						let rect = new RectangleAnimation(0., 1/this.maxRects*i, 1., 1/this.maxRects);
						rect.animationProperties(this.maxRects-i, 2, false, 1);
						this.controller.addRectangle(rect, 0);
					}
				});

		this.render();
	}

	render(props) {
		const width = window.innerWidth * .8;

		return <canvas ref={node => this.node = node}
									 className='project-bg-canvas'
									 width={width}
									 height={width / (640 / 480)}
		/>
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
		uniform sampler2D u_image3;
		
		uniform vec2 u_resolution;
		uniform vec3 u_num_rectangle;
		
		uniform float u_time;
		
		float rectangle(vec2 uv, vec2 pos, vec2 size) {
			pos = vec2(pos.x, 1. - pos.y);
			
			return (step(pos.x, uv.x) - step(pos.x + size.x, uv.x))
				* (step(pos.y - size.y, uv.y) - step(pos.y, uv.y));
		}
		
		//
		// Description : Array and textureless GLSL 2D simplex noise function.
		//      Author : Ian McEwan, Ashima Arts.
		//  Maintainer : stegu
		//     Lastmod : 20110822 (ijm)
		//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
		//               Distributed under the MIT License. See LICENSE file.
		//               https://github.com/ashima/webgl-noise
		//               https://github.com/stegu/webgl-noise
		// 
		
		vec3 mod289(vec3 x) {
			return x - floor(x * (1.0 / 289.0)) * 289.0;
		}
		
		vec2 mod289(vec2 x) {
			return x - floor(x * (1.0 / 289.0)) * 289.0;
		}
		
		vec3 permute(vec3 x) {
			return mod289(((x*34.0)+1.0)*x);
		}
		
		float snoise(vec2 v) {
			const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
													0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
												 -0.577350269189626,  // -1.0 + 2.0 * C.x
													0.024390243902439); // 1.0 / 41.0
			// First corner
			vec2 i  = floor(v + dot(v, C.yy) );
			vec2 x0 = v -   i + dot(i, C.xx);
		
			// Other corners
			vec2 i1;
			//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
			//i1.y = 1.0 - i1.x;
			i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
			// x0 = x0 - 0.0 + 0.0 * C.xx ;
			// x1 = x0 - i1 + 1.0 * C.xx ;
			// x2 = x0 - 1.0 + 2.0 * C.xx ;
			vec4 x12 = x0.xyxy + C.xxzz;
			x12.xy -= i1;
		
			// Permutations
			i = mod289(i); // Avoid truncation effects in permutation
			vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
				+ i.x + vec3(0.0, i1.x, 1.0 ));
		
			vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
			m = m*m ;
			m = m*m ;
			
			// Gradients: 41 points uniformly over a line, mapped onto a diamond.
			// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
		
			vec3 x = 2.0 * fract(p * C.www) - 1.0;
			vec3 h = abs(x) - 0.5;
			vec3 ox = floor(x + 0.5);
			vec3 a0 = x - ox;
		
			// Normalise gradients implicitly by scaling m
			// Approximation of: m *= inversesqrt( a0*a0 + h*h );
			m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
		
			// Compute final noise value at P
			vec3 g;
			g.x  = a0.x  * x0.x  + h.x  * x0.y;
			g.yz = a0.yz * x12.xz + h.yz * x12.yw;
			return 130.0 * dot(m, g);
		}

		vec4 readPixel(vec2 pos) {
			return texture2D(u_image3, (pos + .5)/u_num_rectangle.xy);
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
			
			vec4 textureOne = texture2D(u_image1, flippedUV);
			vec4 textureTwo = texture2D(u_image2, flippedUV);
			
			// x, y, w, h,
			// which texture, timing, is hiding animation, animation direction
			
			// sets the background colour
			gl_FragColor = texture2D(u_image0, flippedUV);
			
			for(float i = 0.; i <= 100.; i++) {
				if(i == u_num_rectangle.z) break;

				vec4 pos = getPositions(i);
				vec4 anim = getAnimationDetails(i);
				
				vec4 texture = textureTwo;
				
				float t = anim.y;
				
				if(anim.x == 2./255.) {
					texture = textureOne;
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
			
			vec4 test = gl_FragColor; //vec4(0., 1., 0., 1.);
			vec4 whitened = mix(test, vec4(.5, .5, .5, 1.), .15);
			
			float n = fract(snoise(uv * u_time) * 918.);
			
			gl_FragColor = mix(test, whitened, step(.55, n));
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
