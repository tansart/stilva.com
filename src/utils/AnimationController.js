export default class AnimationController {
	get length() {
		return this.rectangles.length * 8;
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
			}
		}
		this.rectangles = newRectangles;

		for(let i = 0; i<this.rectangles.length; i++) {
			this.output[i*8*4+4*5+3] = this.rectangles[i].ease(this.rectangles[i].time);
		}
	}

	compile() {
		this.output = this.rectangles.reduce((acc, rect) => {
			return acc.concat(rect.getData());
		}, []);
	}

	get(delta) {
		const remove = [];
		const length = this.rectangles.length;

		for(let i = 0; i<length; i++) {
			this.rectangles[i].update(delta);
			this.output[i*8*4+4*5+3] = this.rectangles[i].ease(this.rectangles[i].time);

			if(this.rectangles[i].time > 1 && this.rectangles[i].isHiding) {
				remove.push(i);
			}
		}

		this.removeRectangles(remove);

		return this.output;
	}
}
