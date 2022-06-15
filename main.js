String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}


$(document).ready(()=>
{

// GAME BOARD
var rows = 3;
var cols = 3;
var curPlayer=0;
var boxColor = ['rgba(0, 0, 255, 0.5)','rgba(255, 0, 0, 0.5)'];
var lineColor = ['rgb(0, 0, 255)','rgb(255, 0, 0)'];
var filled = []
var ai = localStorage.getItem('ai');
var game = $('#game');
for (let i = 0; i <= rows; i++) {

	var grid = '';
	var container = '<div class="d-flex">';
	grid += container;

	var dot = '<div class="dot"></div>';
	var hline = '<div class="h-line" id="h__"></div>';
	var vline = '<div class="v-line" id="v__"></div>';
	var box = '<div class="box" id="b__"></div>';

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
			box = box.replaceAt(22,i+''+j);
			grid += vline;
			if(j!=cols)
				grid+=box;
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

function drawBox(id, player)
{
	$('#'+id).css('background-color',boxColor[player]);
}


function drawLine(id, player)
{
	$('#'+id).css('background-color',lineColor[player]);
	filled[id]=1;		

	if(id.charAt(0)=='v')
	{
		if(leftBox(id))
		{
			var c = id.charAt(2);
			c--;
			tmpid = id.replaceAt(0,'b');
			tmpid = tmpid.replaceAt(2,c.toString());
			drawBox(tmpid,player);
			filled[tmpid]=1;
		}
		
		if(rightBox(id))
		{
			tmpid = id.replaceAt(0,'b');			
			drawBox(tmpid,player);
			filled[tmpid]=1;
		}
	}
	else
	{
		filled[id]=1;	
		if(topBox(id))
		{
			var r = id.charAt(1);
			tmpid = id.replaceAt(0,'b'+(r-1));
			drawBox(tmpid,player);
			filled[tmpid]=1;
		}
		if(bottomBox(id))
		{
			var r = id.charAt(1);
			tmpid = id.replaceAt(0,'b'+r);
			drawBox(tmpid,player);
			filled[tmpid]=1;
		}
	
	}

	var win = winnercheck(player);
	if(win==-1)
	{
		alert('Its a DRAW');
		document.location.reload();
	}
	else if(win)
	{
		alert('winner is '+player);
		document.location.reload();
	}
}

var hline = $('.h-line');

hline.hover(function()
{
	$(this).addClass('hover'+curPlayer);
	
},function()
{
	$(this).removeClass('hover'+curPlayer);
});


// 3. playAI

function playAI()
{
	for(var i=0;i<=rows;i++)
	{
		for(var j=0;j<cols;j++)
		{
			var id = 'h'+i+j;
			if(!filled['h'+i+j])
			{
				drawLine(id,1);
				return;
			}
		}		
	}

	for(var i=0;i<rows;i++)
	{
		for(var j=0;j<=cols;j++)
		{
			var id = 'v'+i+j;
			if(!filled['v'+i+j])
			{
				drawLine(id,1);
				return;
			}
		}		
	}
}


for (const line of hline) {
	line.addEventListener('click', (e) => {

		var id = (e.target.id);
		if(filled[id])
		{
			return ;
		}
		drawLine(id,curPlayer);
		if(ai=='true')
		{
			playAI();			
		}
		else
		{
			curPlayer=(curPlayer+1)%2;
			$('#current').text(curPlayer);
		}

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
		if(filled[id])
		{
			return;
		}
		drawLine(id,curPlayer);
		
		if(ai=='true')
		{
			playAI();
			return;
		}
		else
		{
			curPlayer=(curPlayer+1)%2;
			$('#current').text(curPlayer);
		}

	});
}


// 3. Check Winner
function winnercheck(player)
{
	var cur=0,other=0;;
	for(var i=0;i < rows; i++)
	{
		for(var j=0;j<=cols;j++)
		{
			var filled = $('#b'+i+j).css('background-color') == boxColor[player];
			if(filled)
				cur++;	
			filled = $('#b'+i+j).css('background-color') == boxColor[1-player];
			if(filled)
				other++;	
		}
	}
	if((cur == other) && ((cur+other)==rows*cols) )
	{
		return -1;
	}
	return cur>(rows*cols)/2;
}


// 4. New Game
var newGameTypes = $('.dropdown-menu > li > a');
for(const type of newGameTypes)
{
	type.addEventListener('click',()=>{
		document.location.reload();
		if(type.text=='VS AI')
		{
			localStorage.setItem("ai", 'true');

		}
		else
		{
			localStorage.setItem("ai", 'false');
		}
	});
};

$('#current').text(curPlayer);

});
