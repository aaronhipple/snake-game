/* global GridChild, options */

class Food extends GridChild { // eslint-disable-line no-unused-vars
	constructor(cell) {
		super(cell);
		this.age = 0;
	}

	update() {
		this.age++;
		if (this.age > options.foodMaxAge) {
			this.destroy();
		}
	}
}
