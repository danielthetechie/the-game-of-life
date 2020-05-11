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

		this.getCellIdByPosition = function (pos_x, pos_y)
		{
			let cell_id = null;
			let board_width = this.length_x;

			// No id for negative coordinates.
			if ((pos_x * pos_y < 0) || (pos_x < 0 && pos_y < 0))
				return null;

			cell_id = (board_width * pos_y) + pos_x;

			return cell_id;
		}

		this.syncCellActiveTagWithObjById = function (cell_id)
		{
			const board_tag = document.getElementById (this.id);
			const cell_tags = board_tag.getElementsByClassName (CELL_CLASSNAME);

			if (this.cells[cell_id].is_active)
			{
				cell_tags[cell_id].classList.remove (INACTIVE_CLASSNAME);
				cell_tags[cell_id].classList.add (ACTIVE_CLASSNAME);	
			} else {			
				cell_tags[cell_id].classList.remove (INACTIVE_CLASSNAME);
				cell_tags[cell_id].classList.add (ACTIVE_CLASSNAME);
			}
		}

		this.syncAllCellsActivity = function ()
		{
			const board_tag = document.getElementById (this.id);
			const cell_tags = board_tag.getElementsByClassName (CELL_CLASSNAME);
			const cells_total = cell_tags.length;

			for (let id = 0; id < cells_total; id++)
			{
				this.syncCellActiveTagWithObjById (id);
			}
		}

		// Returns an array of cells who are neighbours of a cell whose id is cell_id.
		this.getCellNeighboursById = function (cell_id)
		{
			let neighbours = [];

			let x0 = this.cells[cell_id].pos_x;
			let y0 = this.cells[cell_id].pos_y;

			for (let x = x0 - 1; x <= x0 + 1; x++)
			{
				for (let y = y0 - 1; y <= y0 + 1; y++)
				{
					/*	The third condition implies that 
						a cell can't be a neighbour of itself. */
					if (	(x >= 0 && y >= 0) 
						&&	(x < this.length_x && y < this.length_y) 
						&&	(x != x0 || y != y0))
					{
						let neighbour_id = this.getCellIdByPosition (x, y);
						neighbours.push (this.cells[neighbour_id]);
					}
				}
			}

			return neighbours;
		}

		this.countActiveNeighboursByCellId = function (cell_id)
		{
			let active_neighbours = 0;
			let neighbours = this.getCellNeighboursById (cell_id);

			for (let i = 0; i < neighbours.length; i++)
				if (neighbours[i].is_active)
					active_neighbours++;

			return active_neighbours;
		}

		this.setCellActivity = function (cell_id, is_active)
		{
			this.cells[cell_id].is_active = is_active;
			this.syncCellActiveTagWithObjById (cell_id);
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

	/*
		Any live cell with two or three live neighbours survives.
		Any dead cell with three live neighbours becomes a live cell.
		All other live cells die in the next generation. Similarly, all other dead cells stay dead.
	*/

	for (let i = 0; i < cells.length; i++)
	{
		// Reminder: i = cell_id.
		let num_active_neighbours = board.countActiveNeighboursByCellId (i);

		if (cells[i].is_active)
		{
			if (num_active_neighbours == 2 || num_active_neighbours == 3){
				board.setCellActivity (i, true);

			} else { 
				board.setCellActivity (i, false);
			}

		} else {
			if (num_active_neighbours == 3) {
				board.setCellActivity (i, true);
			}
		}
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

	const cell_tags = board_tag.getElementsByClassName (CELL_CLASSNAME);
	const start_button = document.getElementById (START_BUTTON_ID);
	
	start_button.addEventListener ('click', event =>
	{
		let cells = updateCellsToGen (board, 1);
		
		Array.from (cell_tags).forEach (cell_tag => 
		{
			//board.syncCellsActiveTagWithObjById (cell_tag.id);
		});
	});
});