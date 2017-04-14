/* global GridChild */

class SnakeTail extends GridChild {
  // eslint-disable-line no-unused-vars
  constructor(cell, head) {
    super(cell);
    Object.assign(this, { head });
  }
}
