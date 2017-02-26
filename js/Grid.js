class Grid {
	constructor(width, height, renderer) {
		Object.assign(this, { width, height, renderer });
		this.initializeGrid(width, height);
		this.snake = new Snake(
			this.getCell(Math.round(width / 2), Math.round(height / 2))
		).attachGrid(this);
	}

	initializeGrid(width, height) {
		this.cells = [];
		for (const x of Array(width).keys()) {
			this.cells.push([]);
			for (const y of Array(height).keys()) {
				this.cells[x].push(new Cell(x, y).attachTo(this));
			}
		}
	}

	start() {
		this.ticker = setInterval(() => this.tick.call(this), options.tickTime);
		this.tick(); // Just to get started
	}

	stop() {
		clearInterval(this.ticker);
		alert(`You lose. Your snake was ${this.snake.size} big.`);
	}

	tick() {
		this.maybeAddFood();
		this.getChildren().forEach(child => child.update());
		this.renderer.draw(this);
	}

	maybeAddFood() {
		if (Math.random() < options.chanceToAddFood) {
			this.addFood();
		}
	}

	getRandomCell() {
		const coords = {
			x: Math.floor(Math.random() * (this.width)),
			y: Math.floor(Math.random() * (this.height)),
		};
		return this.getCell(coords.x, coords.y);
	}

	addFood() {
		let cell = this.getRandomCell();
		while (cell.hasChild()) cell = this.getRandomCell();
		return new Food(cell).attachGrid(this);
	}

	getCell(x, y) {
		if (x < 0 ||
			y < 0 ||
			x >= this.width ||
			y >= this.height) {
			return null;
		}
		return this.cells[x][y];
	}

	getChildren() {
		const children = [];
		this.cells.forEach(row => {
			row.forEach(cell => {
				if (cell.hasChild()) children.push(cell.getChild());
			});
		});
		return children;
	}
}
