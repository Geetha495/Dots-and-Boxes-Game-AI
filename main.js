

var game = $('#game');

for (let i = 0; i < 5; i++) {


	var grid = '';

	var container = '<div class="d-flex">';

	grid += container;


	var dot = '<div class="dot"></div>';
	var hline = '<div class="h-line"></div>';
	var col = '<div class="v-line"></div>'

	for (let j = 0; j < 5; j++) {
		grid += dot;
		if(j!=4)
			grid += hline;
	}
	grid += '</div>';

	if (i != 4) {
		grid += container;
		for (let j = 0; j < 5; j++) {
			grid += col;
		}
		grid += '</div>';
	}

	game.append(grid);

}


var hline = $('.h-line');

for (const line of hline) {
	line.addEventListener('click', (e) => {
		e.target.style.background = 'aqua';
	});
}

var vline = $('.v-line');

for (const line of vline) {
	line.addEventListener('click', (e) => {
		e.target.style.background = 'aqua';
	});
}
