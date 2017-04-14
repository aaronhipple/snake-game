class GridChild {
  // eslint-disable-line no-unused-vars
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
    delete this;
  }
}
