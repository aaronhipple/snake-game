class SnakeTail extends GridChild {
	constructor(cell, head) {
		super(cell);
		Object.assign(this, { head });
	}
}
