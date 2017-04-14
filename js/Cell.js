/* global GridChild */

class Cell {
  // eslint-disable-line no-unused-vars
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
      throw new Error("child must be instance of GridChild");
    }
    this.child = child;
    return this;
  }

  getChild() {
    return this.child;
  }

  hasChild() {
    return this.child instanceof GridChild;
  }

  getNeighbor(direction) {
    switch (direction) {
      case "up":
        return this.grid.getCell(this.x, this.y - 1);
      case "down":
        return this.grid.getCell(this.x, this.y + 1);
      case "right":
        return this.grid.getCell(this.x + 1, this.y);
      case "left":
        return this.grid.getCell(this.x - 1, this.y);
    }
  }
}
