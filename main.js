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
			cell_tag.setAttribute ("class", "cell");
			cell_tag.classList.add (cell.is_active ? "active" : "inactive");

			return cell_tag;
		}

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

function setBoardTagWidth (board, cell_width)
{
	// We add the extra 'board.length_x' factor because 
	// each single cell has a right border of 1px width.
	let width = (board.length_x * cell_width) + board.length_x;

	const board_tag = document.getElementById (board.id);
	board_tag.setAttribute ("style", "width:" + width + "px");

	return width;
}

const board_width = 20;
const board_height = 15;

const cell_tag_width = 10;

window.addEventListener ('DOMContentLoaded', (event) => 
{
	const board = new Board ("board", board_width, board_height);

	const board_tag_width = setBoardTagWidth (board, cell_tag_width);
});