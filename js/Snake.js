/* global GridChild, SnakeTail, options, Food */

class Snake extends GridChild { // eslint-disable-line no-unused-vars
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
			this.grid.renderer.flash('end');
			this.grid.notify(`You lose. Your snake was ${this.size} big.`);
		}
	}

	checkFoods(cell) {
		if (cell === null) return;
		if (cell.child instanceof Food) {
			cell.child.destroy();
			this.size++;

			this.grid.renderer.flash('food');
		}

	}

	checkSnakes(cell) {
		if (!cell.hasChild()) return;
		if (cell.getChild() instanceof Snake ||
			cell.getChild() instanceof SnakeTail) {
			this.grid.stop();
			this.grid.renderer.flash('end');
			this.grid.notify(`You lose. Your snake was ${this.size} big.`);

		}
	}

	updateTail(cell) {
		this.tail.unshift(new SnakeTail(cell, this).attachGrid(this.grid));
		if (this.tail.length >= this.size) {
			this.tail.pop().destroy();
		}
	}
}
