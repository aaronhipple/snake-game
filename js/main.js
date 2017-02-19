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
	}
}

class GridChild {
	constructor(x, y) {
		Object.assign(this, { x, y });
		this.id = `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
	}

	attachTo(grid) {
		this.grid = grid;
		return this;
	}

	update() {}

	destroy() {
		const childIndex = this.grid.children
			.findIndex(child => child.id === this.id);
		this.grid.children.splice(childIndex, 1);
		delete(this);
	}
}

class Snake extends GridChild {
	constructor(x, y) {
		super(x, y);
		this.size = options.startingLength;
		this.direction = 'up';
		this.tail = [];
		this.initializeTail();
		this.registerKeyListeners();		
	}

	initializeTail() {
		for (const i of Array(this.size - 1).keys()) {
			this.tail.push({
				x: this.x,
				y: this.y + (i + 1),
			});
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
		this.updateTail();
		this.updateHeadPosition();
		this.checkCollisions();
	}

	checkCollisions() {
		this.checkGrid();
		this.checkFoods();
	}

	checkGrid() {
		if (this.x < 0 ||
			this.y < 0 ||
			this.x >= this.grid.width ||
			this.y >= this.grid.height) {
			this.grid.stop();
		}
	}

	checkFoods() {
		this.grid.children
			.filter((child) => {
				return child instanceof Food && child.x === this.x && child.y === this.y;
			})
			.map((food) => {
				food.destroy();
				this.size++;
			});
	}

	updateHeadPosition() {
		switch (this.direction) {
		case 'up':
			this.y--;
			break;
		case 'down':
			this.y++;
			break;
		case 'right':
			this.x++;
			break;
		case 'left':
			this.x--;
			break;
		default:
			throw new Error('Invalid direction for Snake update');
		}
	}

	updateTail() {
		this.tail.unshift({ x: this.x, y: this.y });
		this.tail = this.tail.slice(0, this.size - 1);
	}
}

class Food extends GridChild {
	constructor(x, y) {
		super(x, y);
		this.age = 0;
	}

	update() {
		this.age++;
		if (this.age > options.foodMaxAge) {
			this.destroy();
		}
	}
}

class Grid {
	constructor(width, height, renderer) {
		Object.assign(this, { width, height, renderer });
		this.cells = Array(width).fill(Array(height).fill(null).map(() => new Cell()));
		this.children = [];
		this.addChild(new Snake(Math.floor(width / 2), Math.floor(height / 2)));
	}

	start() {
		this.ticker = setInterval(() => this.tick.call(this), options.tickTime);
		this.tick(); // Just to get started
	}

	stop() {
		clearInterval(this.ticker);
	}

	tick() {
		this.renderer.draw(this);
		this.maybeAddFood();
		this.children.forEach(child => child.update());
	}

	maybeAddFood() {
		if (Math.random() < options.chanceToAddFood) {
			this.addFood();
		}
	}

	addFood() {
		const coords = {
			x: Math.floor(Math.random() * (this.width)),
			y: Math.floor(Math.random() * (this.height)),
		};

		this.addChild(new Food(coords.x, coords.y));
	}

	addChild(child) {
		this.children.push(child.attachTo(this));
	}
}

const game = new Grid(options.gridSize.width, options.gridSize.height, new HTMLRenderer('#snake-game'));
game.start();