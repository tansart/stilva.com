export default class RectangleAnimation {
	constructor(x, y, w, h) {
		this.x = x * 255;
		this.y = y * 255;
		this.w = w * 255;
		this.h = h * 255;

		this.output = null;

		this.time = 0;
	}

	ease(r) {
		return (r === 1 ? 1 : 1 - Math.pow(2, - 10 * r)) * 255;
	}

	animationProperties(texture, isShowAnimation, direction) {
		this.texture = texture;
		this.isShowAnimation= isShowAnimation;
		this.direction = direction;
	}

	getData() {
		this.output = this.output || [
			this.x, this.y, this.w, this.h,
			this.texture, 0 /* time */, this.isShowAnimation? 0: 255, this.direction
		];

		return this.output;
	}
}
