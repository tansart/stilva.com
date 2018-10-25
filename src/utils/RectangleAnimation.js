export default class RectangleAnimation {
	get time() {
		return this._time/this.duration;
	}

	constructor(x, y, w, h) {
		this.x = x * 255;
		this.y = y * 255;
		this.w = w * 255;
		this.h = h * 255;

		this.output = null;

		this._time = 0;
		this._cancelled = false;
	}

	ease(r) {
		return (r === 1 ? 1 : 1 - Math.pow(2, - 10 * r)) * 255;
	}

	update(delta) {
		if(this._cancelled) return;
		this._time += delta;
	}

	animationProperties(duration, texture, isHiding, direction) {
		this.duration = duration / 1000;
		this.texture = texture;
		this.isHiding = isHiding;
		this.direction = direction;
	}

	getData() {
		this.output = this.output || [
			0,0,0,this.x,
			0,0,0,this.y,
			0,0,0,this.w,
			0,0,0,this.h,
			0,0,0,this.texture,
			0,0,0,0 /* time */,
			0,0,0,this.isHiding? 255: 0,
			0,0,0,this.direction < 0 ? 0: 255 /* -1 to left, 1 to right */
		];

		return this.output;
	}
}
