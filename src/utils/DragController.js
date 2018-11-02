export default class AnimationController {

	constructor() {
		this.rectangles = [[]];
		this.output = [];
	}

	getLength(texture) {
		return this.rectangles[texture].length * 8 || 1;
	}

	addRectangle(rect, texture) {
		if(!Array.isArray(this.rectangles[texture])) {
			this.rectangles[texture] = [];
		}

		this.rectangles[texture].push(rect);

		this.compile(texture);
	}

	removeRectangles(rectIDs = [], texture) {
		if(!rectIDs.length)
			return;

		this.output = [];

		const newRectangles = [];

		for(let i = 0; i<this.rectangles[texture].length; i++) {
			if(rectIDs.indexOf(i) === -1) {
				newRectangles.push(this.rectangles[texture][i]);
				this.output = this.output.concat(this.rectangles[texture][i].getData());
			} else {
				this.rectangles[texture][i].remove();
			}
		}
		this.rectangles[texture] = newRectangles;

		for(let i = 0; i<this.rectangles[texture].length; i++) {
			// [i*8*4+4*5+3]
			this.output[i*32 + 23] = this.rectangles[texture][i].ease(this.rectangles[texture][i].time);
		}
	}

	compile(texture) {
		this.output = this.rectangles[texture].reduce((acc, rect) => {
			return acc.concat(rect.getData());
		}, []);
	}

	get(delta, texture) {
		const remove = [];
		const length = this.rectangles[texture].length;

		for(let i = 0; i<length; i++) {
			this.rectangles[texture][i].update(delta);

			if(this.rectangles[texture][i]._time < 0) this.rectangles[texture][i]._time = 0;
			if(this.rectangles[texture][i]._time > 1) this.rectangles[texture][i]._time = 1;

			this.output[i*8*4+4*5+3] = this.rectangles[texture][i].ease(this.rectangles[texture][i].time);
		}

		this.removeRectangles(remove, texture);

		if(this.rectangles[texture].length == 0) {
			return [0,0,0,0];
		}

		return this.output;
	}
}
