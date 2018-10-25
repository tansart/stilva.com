export default class AnimationController {
	get length() {
		return this.rectangles.length * 2;
	}

	constructor() {
		this.rectangles = [];
		this.output = [];
	}

	addRectangle(rect) {
		this.rectangles.push(rect);

		this.output = this.rectangles.reduce((acc, rect) => {
			return acc.concat(rect.getData(0));
		}, []);
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
	}

	get(delta) {
		const remove = [];
		const length = this.rectangles.length;

		for(let i = 0; i<length; i++) {
			this.rectangles[i].time += delta;
			this.output[i*8+5] = this.rectangles[i].ease(this.rectangles[i].time);

			if(this.rectangles[i].time > 1 && !this.rectangles[i].isShowAnimation) {
				// remove.push(i);
			}
		}

		this.removeRectangles(remove);

		return this.output;
	}
}
