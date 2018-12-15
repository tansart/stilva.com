import React, {Component, createRef} from 'react'; // eslint-disable-line no-unused-vars
import cx from 'classnames';

export default class TransitionCanvas extends Component {

	static animationTime = 250;

	constructor(props) {
		super(props);

		this.node = createRef();
	}

	componentDidMount() {
		if(!this.props.previousLocation) {
			return;
		}

		this.gl = this.node.current.getContext('webgl', {antialias: true});

		let toColor = [1., 1., 1., 1.];

		if(this.props.location.pathname == '/') {
			toColor = [0., 0., 0., 1.];
		}

		if (!this.gl) {
			return null;
		}

		this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);

		const {vertex, fragment} = getShaders();

		const program = setupProgram(this.gl, vertex, fragment);

		const positionLocation = this.gl.getAttribLocation(program, "a_position");
		this.gl.enableVertexAttribArray(positionLocation);
		this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

		const timeLocation = this.gl.getUniformLocation(program, "u_time");
		const resolutionLocation = this.gl.getUniformLocation(program, "u_resolution");
		const colorToLocation = this.gl.getUniformLocation(program, "u_to_color");

		let delta = 0;
		let initTime = Date.now();

		this.render = () => {
			if (!this.kill && delta <= 1) {
				requestAnimationFrame(this.render);
			}

			delta = (Date.now() - initTime)/TransitionCanvas.animationTime;

			this.gl.clear(this.gl.COLOR_BUFFER_BIT);
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

			this.gl.uniform1f(timeLocation, delta);
			this.gl.uniform2fv(resolutionLocation, [window.innerWidth, window.innerHeight]);

			this.gl.uniform4fv(colorToLocation, toColor);
		};

		requestAnimationFrame(this.render);
	}

	componentWillUnmount() {
		this.kill = true;

		this.render = _ => {};

		this.gl && this.gl.getExtension('WEBGL_lose_context').loseContext();
	}

	render() {
		return <canvas ref={this.node}
									 className='transition-canvas'
									 width={window.innerWidth}
									 height={window.innerHeight}
		/>;
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
		
		uniform vec2 u_resolution;

		uniform vec4 u_to_color;
		
		uniform float u_time;
		
		float quadraticOut(float k) {
			return k * (2. - k);
		}
		
		float cubicIn(float k) {
			return k * k * k;
		}
		
		void main() {   
			vec2 uv = gl_FragCoord.xy/u_resolution.xy;
			
			float easeCorner = cubicIn(u_time);
			
			vec2 A = vec2(easeCorner, .0);
			vec2 B = vec2(.05 + quadraticOut(u_time), .5);
			vec2 C = vec2(easeCorner, 1.);  
			
			// Compute vectors        
			vec2 v0 = C - A;
			vec2 v1 = B - A;
			vec2 v2 = uv - A;
			
			// Compute dot products
			float dot01 = dot(v0, v1);
			float dot02 = dot(v0, v2);
			float dot11 = dot(v1, v1);
			float dot12 = dot(v1, v2);

			// Compute barycentric coordinates
			float invDenom = 1.0 / (dot11 - dot01 * dot01);
			float u = (dot11 * dot02 - dot01 * dot12) * invDenom;
			float v = (dot12 - dot01 * dot02) * invDenom;

			// use the blinn and loop method
			float w = (1.0 - u - v);
			vec2 textureCoord = v * vec2(0.5,0.0) + w * vec2(1.0,1.0);

			// use the sign of the result to decide between grey or black
			float outside = sign(textureCoord.x * textureCoord.x - textureCoord.y);
			outside = clamp(outside, 0., 1.);
			
			gl_FragColor = mix(u_to_color, vec4(0.), outside);
		}`;

	return {vertex, fragment};
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
