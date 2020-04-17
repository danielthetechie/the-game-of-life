///// Constants /////

const ACTIVE_CLASSNAME = "active";
const INACTIVE_CLASSNAME = "inactive";

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 15;

const CELL_CLASSNAME = "cell";
const CELL_TAG_WIDTH = 10;

const START_BUTTON_ID = "start-button";

///////////////////

class Board
{
	constructor (board_id, length_x, length_y)
	{
		this.id = board_id;
		this.length_x = length_x;
		this.length_y = length_y;
		this.cells = Array();

		this.createBoard = function ()
		{
			const board = document.createElement ("div");

			const body = document.getElementsByTagName("body")[0];
			body.appendChild (board);

			board.setAttribute ("id", this.id);

			return board;
		}

		this.createCellTag = function (cell)
		{
			let cell_tag = document.createElement ("div");	
			
			const board = document.getElementById (this.id);
			board.appendChild (cell_tag);

			cell_tag.setAttribute ("id", cell.id);
			cell_tag.setAttribute ("class", CELL_CLASSNAME);
			cell_tag.classList.add (cell.is_active ? ACTIVE_CLASSNAME : INACTIVE_CLASSNAME);

			return cell_tag;
		}

		/*	Creates a cell JS object (which will be appended to `this.cells`)
			and a cell HTML tag for each square of the Board. 
			Each object and tag will share the same id.
		*/
		this.addCells = function ()
		{
			const cells_total = this.length_x * this.length_y;

			for (let i = 0; i < cells_total; i++)
			{
				let cell = {
					id: i,
					is_active: false,
					pos_x: (i % this.length_x),
					pos_y: Math.floor (i / this.length_x)
				};

				this.createCellTag (cell)
				this.cells.push (cell);
			}
		}

		this.createBoard ();
		this.addCells ();
	}
}


/////// Helper functions /////////////

function setBoardTagWidth (board, cell_width)
{
	/* 	We add the extra 'board.length_x' factor because 
		each single cell has a right border of 1px width. */
	let width = (board.length_x * cell_width) + board.length_x;

	const board_tag = document.getElementById (board.id);
	board_tag.setAttribute ("style", "width:" + width + "px");

	return width;
}

function getCellIdByPosition (pos_x, pos_y, board_width)
{
	let cell_id = null;

	// No id for negative coordinates.
	if ((pos_x * pos_y < 0) || (pos_x < 0 && pos_y < 0))
		return null;

	cell_id = (board_width * pos_y) + pos_x;

	return cell_id;
}

/////////////////////////////////

//// Cells activity-statuses toggle functions //////

function toggleCellObjectActiveStatusById (board, id) 
{
	let cell = board.cells[id];
	cell.is_active = !cell.is_active;

	return cell;
}

function toggleCellClassActiveStatusByTag (cell_tag)
{
	if (cell_tag.classList.contains (INACTIVE_CLASSNAME))
	{
		cell_tag.classList.remove (INACTIVE_CLASSNAME);
		cell_tag.classList.add (ACTIVE_CLASSNAME);
	} else if (cell_tag.classList.contains (ACTIVE_CLASSNAME)) {
		cell_tag.classList.remove (ACTIVE_CLASSNAME);
		cell_tag.classList.add (INACTIVE_CLASSNAME);
	} else {
		// Nothing happens.
	}

	return cell_tag;
}

function toggleCellActiveStatusOnClick (board)
{
	const board_tag = document.getElementById (board.id);
	let cell_tags = board_tag.getElementsByClassName (CELL_CLASSNAME);

	Array.from (cell_tags).forEach (cell_tag => 
	{
		cell_tag.addEventListener ('click', event => 
		{
			toggleCellObjectActiveStatusById (board, cell_tag.id);
			toggleCellClassActiveStatusByTag (cell_tag);
		});
	});
}

/////////////////////////////


///// Update board along generations /////////////

function updateCellsToNextGen (board)
{
	let cells = board.cells;

	for (let i = 0; i < cells.length; i++)
	{
		// Need to complete the logic below.
		cell_id = getCellIdByPosition (cells[i].pos_x, cells[i].pos_y, board.length_x);
	}

	return cells;
}

function updateCellsToGen (board, to_generation)
{
	for (let gen = 0; gen < to_generation; gen++)
		board.cells = updateCellsToNextGen (board);

	const cells = board.cells;

	return cells;
}


//// Main /////

window.addEventListener ('DOMContentLoaded', (event) => 
{
	//// Initialize board ////
	const board = new Board ("board", BOARD_WIDTH, BOARD_HEIGHT);
	const board_tag = document.getElementById (board.id);
	const board_tag_width = setBoardTagWidth (board, CELL_TAG_WIDTH);

	toggleCellActiveStatusOnClick (board);
	////////////////////////

	const start_button = document.getElementById (START_BUTTON_ID);
	start_button.addEventListener ('click', event =>
	{
		updateCellsToGen (board, 1);
	});
});