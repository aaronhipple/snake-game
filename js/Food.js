class Food extends GridChild {
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
