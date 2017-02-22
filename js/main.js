/* global HTMLRenderer */

const options = {
	gridSize: {
		width: 60,
		height: 40,
	},
	chanceToAddFood: 2 / 3,
	foodMaxAge: 40,
	tickTime: 250,
	startingLength: 3,
};

class Cell {
	constructor(x, y) {
		Object.assign(this, { x, y });
		this.child = null;
	}

	attachTo(grid) {
		this.grid = grid;
		return this;
	}

	setChild(child) {
		if (child !== null && !(child instanceof GridChild)) {
			throw new Error('child must be instance of GridChild');
		}
		this.child = child;
		return this;
	}

	getChild() {
		return this.child;
	}

	hasChild() {
		return (this.child instanceof GridChild);
	}

	getNeighbor(direction) {
		switch (direction) {
		case 'up': return this.grid.getCell(this.x, this.y - 1);
		case 'down': return this.grid.getCell(this.x, this.y + 1);
		case 'right': return this.grid.getCell(this.x + 1, this.y);
		case 'left': return this.grid.getCell(this.x - 1, this.y);
		}
	}
}

class GridChild {
	constructor(cell) {
		Object.assign(this, { cell });
		this.attach(cell);
	}

	attach(cell) {
		this.detach();
		this.cell = cell;
		cell.setChild(this);
		return this;
	}

	attachGrid(grid) {
		this.grid = grid;
		return this;
	}

	update() {}

	detach() {
		if (this.cell) this.cell.setChild(null);
		this.cell = null;
		return this;
	}

	destroy() {
		this.detach();
		delete(this);
	}
}

class Snake extends GridChild {
	constructor(cell) {
		super(cell);
		this.size = options.startingLength;
		this.direction = 'up';
		this.tail = [];
		this.initializeTail();
		this.registerKeyListeners();
	}

	initializeTail() {
		let cell = this.cell;
		// eslint-disable-next-line no-unused-vars
		for (const i of Array(this.size - 1).keys()) {
			cell = cell.getNeighbor('down');
			this.tail.push(new SnakeTail(cell, this).attachGrid(cell.grid));
		}
	}

	registerKeyListeners() {
		window.addEventListener('keydown', (e) => {
			switch (e.keyCode) {
			case 37: if (this.direction !== 'right') this.direction = 'left'; break;
			case 38: if (this.direction !== 'down') this.direction = 'up'; break;
			case 39: if (this.direction !== 'left') this.direction = 'right'; break;
			case 40: if (this.direction !== 'up') this.direction = 'down'; break;
			}
		});
	}

	update() {
		const newCell = this.cell.getNeighbor(this.direction);
		this.checkCollisions(newCell);
		if (newCell === null) return;
		const oldCell = this.cell;
		this.detach().attach(newCell);
		this.updateTail(oldCell);
	}

	checkCollisions(newCell) {
		this.checkGrid(newCell);
		this.checkFoods(newCell);
		this.checkSnakes(newCell);
	}

	checkGrid(cell) {
		if (cell === null) {
			this.grid.stop();
		}
	}

	checkFoods(cell) {
		if (cell === null) return;
		if (cell.child instanceof Food) {
			cell.child.destroy();
			this.size++;
		}
	}

	checkSnakes(cell) {
		if (!cell.hasChild()) return;
		if (cell.getChild() instanceof Snake ||
			cell.getChild() instanceof SnakeTail) {
			this.grid.stop();
		}
	}

	updateTail(cell) {
		this.tail.unshift(new SnakeTail(cell, this).attachGrid(this.grid));
		if (this.tail.length >= this.size) {
			this.tail.pop().destroy();
		}
	}
}

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

class SnakeTail extends GridChild {
	constructor(cell, head) {
		super(cell);
		Object.assign(this, { head });
	}
}

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

const game = new Grid(options.gridSize.width, options.gridSize.height, new HTMLRenderer('#snake-game'));
game.start();
