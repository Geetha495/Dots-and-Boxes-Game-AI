String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}


$(document).ready(()=>
{

// GAME BOARD
var rows = 2;
var cols = 2;
var curPlayer=0;
var boxColor = ['rgba(0, 0, 255, 0.5)','rgba(255, 0, 0, 0.5)'];
var lineColor = ['rgb(0, 0, 255)','rgb(255, 0, 0)'];

var game = $('#game');
for (let i = 0; i <= rows; i++) {

	var grid = '';
	var container = '<div class="d-flex">';
	grid += container;

	var dot = '<div class="dot"></div>';
	var hline = '<div class="h-line" id="h__"></div>';
	var vline = '<div class="v-line" id="v__"></div><div class="box" id="b__"></div>';

	for (let j = 0; j <= cols; j++) {
		grid += dot;
		if(j!=cols)
		{
			hline = hline.replaceAt(25,i+''+j);
			grid += hline;
		}
	}
	grid += '</div>';

	if (i != rows) {
		grid += container;
		for (let j = 0; j <= cols; j++) {
			vline = vline.replaceAt(25,i+''+j);
			vline = vline.replaceAt(57,i+''+j);
			grid += vline;
		}
		grid += '</div>';
	}

	game.append(grid);

}

// WORKING

//1. Check if BOX is formed

function topBox(id)
{
	var r = id.charAt(1);
	var c = id.charAt(2);

	if(r=='0')
		return 0;

	r--;
	var left = $('#v'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	var top = $('#h'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	c++;
	var right = $('#v'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	
	if(left || right || top)
		return 0;

	return 1;
}


function bottomBox(id)
{
	var r = id.charAt(1);
	var c = id.charAt(2);

	if((r-'0')==rows)
		return 0;
	
	var left = $('#v'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	r++;
	var bottom = $('#h'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	c++;
	r--;
	var right = $('#v'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	
	if(left || right || bottom)
		return 0;

	return 1;
}


function leftBox(id)
{
	var r = id.charAt(1);
	var c = id.charAt(2);

	if(c=='0')
		return 0;

	c--;
	var top = $('#h'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	var left = $('#v'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	r++;
	var bottom = $('#h'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	
	if(bottom || left || top)
		return 0;

	return 1;
}


function rightBox(id)
{
	var r = id.charAt(1);
	var c = id.charAt(2);

	if((c-'0')==(cols))
		return 0;

	var top = $('#h'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	r++;			
	var bottom = $('#h'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';
	c++;
	r--;
	var right = $('#v'+r+c).css('background-color')=='rgba(0, 0, 0, 0)';

	if(top || right || bottom)
		return 0;

	return 1;
}


// 2. Draw line ( and Box if needed)
function drawLine(id, player)
{
	$('#'+id).css('background-color',lineColor[player]);
}

function drawBox(id, player)
{
	$('#'+id).css('background-color',boxColor[player]);
}

var hline = $('.h-line');

hline.hover(function()
{
	$(this).addClass('hover'+curPlayer);
	
},function()
{
	$(this).removeClass('hover'+curPlayer);
});


for (const line of hline) {
	line.addEventListener('click', (e) => {

		var id = (e.target.id);
		drawLine(id,curPlayer);
		
		if(topBox(id))
		{
			var r = id.charAt(1);
			id = id.replaceAt(0,'b'+(r-1));
			drawBox(id,curPlayer);
		}
		var id = (e.target.id);
		if(bottomBox(id))
		{
			var r = id.charAt(1);
			id = id.replaceAt(0,'b'+r);
			drawBox(id,curPlayer);
		}

		if(winnercheck(curPlayer))
		{
			alert('winner is '+curPlayer);
			document.location.reload();
		}
		curPlayer=(curPlayer+1)%2;
		$('#current').text(curPlayer);

	});	
}



var vline = $('.v-line');
vline.hover(function()
{
	$(this).addClass('hover'+curPlayer);
},function()
{
	$(this).removeClass('hover'+curPlayer);
});


for (const line of vline) {
	line.addEventListener('click', (e) => {
		var id = (e.target.id);	
		drawLine(id,curPlayer);

		if(leftBox(id))
		{
			var c = id.charAt(2);
			c--;
			id = id.replaceAt(0,'b');
			id = id.replaceAt(2,c.toString());
			drawBox(id,curPlayer);
		}
		var id = (e.target.id);
		if(rightBox(id))
		{
			id = id.replaceAt(0,'b');			
			drawBox(id,curPlayer);
		}

		if(winnercheck(curPlayer))
		{
			alert('winner is '+curPlayer);
			document.location.reload();
		}
		curPlayer=(curPlayer+1)%2;
		$('#current').text(curPlayer);

	});
}


// 3. Check Winner
function winnercheck(player)
{
	var cur=0;
	for(var i=0;i < rows; i++)
	{
		for(var j=0;j<=cols;j++)
		{
			var filled = $('#b'+i+j).css('background-color') == boxColor[player];
			if(filled)
				cur++;	
		}
	}
	console.log(cur);
	return cur>(rows*cols)/2;
}


// 4. New Game
var newGameTypes = $('.dropdown-menu li a');
for(const type of newGameTypes)
{
	type.addEventListener('click',()=>{
	document.location.reload();
	});
};


$('#current').text(curPlayer);

});
