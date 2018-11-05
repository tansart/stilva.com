export default class AnimationController {

	get length() {
		return this.rectangles.length * 8 || 1;
	}

	constructor() {
		this.rectangles = [];
		this.output = [];
	}

	addRectangle(rect) {
		this.rectangles.push(rect);

		this.compile();
	}

	removeRectangles(rectIDs = []) {
		if(!rectIDs.length)
			return;

		this.output = [];

		const newRectangles = [];

		for(let i = 0; i<this.rectangles.length; i++) {
			if(rectIDs.indexOf(i) === -1) {
				newRectangles.push(this.rectangles[i]);
				this.output = this.output.concat(this.rectangles[i].getData());
			} else {
				this.rectangles[i].remove();
			}
		}
		this.rectangles = newRectangles;

		for(let i = 0; i<this.rectangles.length; i++) {
			this.output[i*32 + 23] = this.rectangles[i].ease(this.rectangles[i].time);
		}
	}

	compile(texture) {
		this.output = this.rectangles.reduce((acc, rect) => {
			return acc.concat(rect.getData());
		}, []);
	}

	get(delta) {
		const remove = [];
		const length = this.rectangles.length;

		for(let i = 0; i<length; i++) {
			if(this.rectangles[i]._texture === 2) {
				if(delta < 0) {
					this.rectangles[i]._time = -1 * delta;
				} else {
					this.rectangles[i]._time *= .8;
				}
			} else {
				if(delta > 0) {
					this.rectangles[i]._time = delta;
				} else {
					this.rectangles[i]._time *= .8;
				}
			}

			if(this.rectangles[i]._time < 0) this.rectangles[i]._time = 0;
			if(this.rectangles[i]._time > 1) this.rectangles[i]._time = 1;

			this.output[i*8*4+4*5+3] = this.rectangles[i].ease(this.rectangles[i].time);

			// i == 0 && console.log(this.rectangles[i]._time, this.rectangles[i]._duration)
		}

		this.removeRectangles(remove);

		if(this.rectangles.length == 0) {
			return [0,0,0,0];
		}

		return this.output;
	}
}
