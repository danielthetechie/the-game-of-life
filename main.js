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

		this.createCellTag = function (cell_id)
		{
			let cell = document.createElement ("div");	
			
			const board = document.getElementById (this.id);
			board.appendChild (cell);

			cell.setAttribute ("id", cell_id);

			return cell;
		}

		this.addCells = function ()
		{
			const cells_total = this.length_x * this.length_y;

			for (let i = 0; i < cells_total; i++)
			{
				let cell = {
					cell_id: i,
					cell_tag: this.createCellTag (i),
					is_active: false,
					pos_x: (i % this.length_x),
					pos_y: Math.floor (i / this.length_x)
				};

				this.cells.push (cell);
			}
		}

		this.createBoard ();
		this.addCells ();
	}
}

const board_width = 5;
const board_height = 7;

window.addEventListener ('DOMContentLoaded', (event) => 
{
	const board = new Board ("board", board_width, board_height);
	
	
});