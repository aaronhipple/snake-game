class HTMLRenderer { // eslint-disable-line no-unused-vars
	constructor(element) {
		if (element instanceof Element) {
			this.element = element;
		} else if (typeof(element) === 'string') {
			this.element = this.resolveSelector(element);
		} else {
			throw new Error('Invalid element argument given to HTMLRenderer (must be a selector or an Element)');
		}
		this.gridInitialized = false;
	}

	resolveSelector(selector) {
		const element = document.querySelector(selector);

		if (element === null) {
			throw new Error('Invalid element argument given to HTMLRenderer (selector resolved no elements)');
		} else {
			return element;
		}
	}

	initializeGrid(width, height) {
		const rows = Array(height).fill(null).map(() => this.makeElement(['row']));
		rows.forEach((row) => {
			const cells = Array(width).fill(null).map(() => this.makeElement(['cell']));
			cells.forEach(cell => row.appendChild(cell));
			this.element.appendChild(row);
		});

		this.gridInitialized = true;
	}

	makeElement(classes) {
		const element = document.createElement('div');
		element.setAttribute('class', classes.join(' '));
		return element;
	}

	draw(grid) {
		if (!this.gridInitialized) {
			this.initializeGrid(grid.width, grid.height);
		}

		this.cleanMarkings();
		this.drawChildren(grid);
	}

	cleanMarkings() {
		['food', 'snake', 'snaketail'].forEach((marking) => {
			const els = this.element.querySelectorAll(`.${marking}`);
			if (els.length === 0) return;
			els.forEach(el => el.classList.remove(marking));
		});
	}

	drawChildren(grid) {
		const children = grid.getChildren();
		children.forEach((child) => {
			this.markCell(child.constructor.name)(child.cell.x)(child.cell.y);
		});
	}

	markCell(marking) {
		return (x) => (y) => {
			const cell = this.element
				.querySelectorAll('.row').item(y)
				.querySelectorAll('.cell').item(x);
			cell.classList.add(marking.toLowerCase());
		};
	}
}