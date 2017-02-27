/* global HTMLRenderer, Grid */

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

const game = new Grid(options.gridSize.width, options.gridSize.height, new HTMLRenderer('#snake-game'));

var startButton = document.getElementById('start');
var resetButton = document.getElementById('reset');
// game.start();

startButton.addEventListener('click', function () {
	game.start();
});
