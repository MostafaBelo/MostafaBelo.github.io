cells = document.getElementsByClassName("cell");

if (cells.length == 0) {
	throw "No Cells found";
}

class Game {
	constructor(cells, maxHistorySize = 6) {
		this.cells = cells;
		this.maxHistorySize = maxHistorySize;
		this.setupCells();
		this.clearBoard();
		this.isPlaying = false;
	}

	setupCells() {
		for (let index = 0; index < cells.length; index++) {
			const cell = cells[index];
			cell.classList.value = "cell";

			cell.onclick = (e) => {
				this.squareClicked(index);
			};
		}
	}

	clearBoard() {
		this.board = ["-", "-", "-", "-", "-", "-", "-", "-", "-"];
		this.history = [];
		this.currentPlayer = "x";
		this.isWin = 0;

		this.updateBoardUI();
	}

	startNewGame() {
		this.clearBoard();
		this.isPlaying = true;
	}

	squareClicked(sqIndex) {
		if (!this.isPlaying) return;
		if (this.board[sqIndex] != "-") return;

		this.place(sqIndex, this.currentPlayer);
		this.switchTurn();
		this.updateBoardUI();
	}

	switchTurn() {
		if (this.currentPlayer == "x") this.currentPlayer = "o";
		else if (this.currentPlayer == "o") this.currentPlayer = "x";
	}

	place(cellNum, val) {
		if (!this.isPlaying) return;

		if (!(0 <= cellNum && cellNum < 9)) {
			throw "Invalid cell index";
		}

		if (val != "x" && val != "o" && val != "-") {
			throw "Invalid cell value";
		}

		this.board[cellNum] = val;

		this.piecePlaced(cellNum, val);
	}

	piecePlaced(cellNum, val) {
		if (!this.isPlaying) return;

		// update history
		this.history.push(cellNum);
		if (this.history.length > this.maxHistorySize) {
			let removedIndex = this.history.shift();
			this.board[removedIndex] = "-";
		}

		// check win
		let isWin = 0; // 0 draw, 1 x win, -1 o win
		for (let i = 0; i < 3; i++) {
			isWin += this.checkWin(3 * i, 3 * i + 1, 3 * i + 2);

			isWin += this.checkWin(i, i + 3, i + 6);
		}

		isWin += this.checkWin(0, 4, 8);
		isWin += this.checkWin(2, 4, 6);

		if (isWin < -1) isWin = -1;
		else if (isWin > 1) isWin = 1;

		this.isWin = isWin;
	}

	checkWin(i1, i2, i3) {
		let isWin = 0;
		if (this.board[i1] == this.board[i2] && this.board[i1] == this.board[i3]) {
			if (this.board[i1] == "x") isWin = 1;
			else if (this.board[i1] == "o") isWin = -1;
		}

		return isWin;
	}

	updateBoardUI() {
		let toBeRemovedIndex = -1;
		if (this.history.length == this.maxHistorySize)
			toBeRemovedIndex = this.history[0];

		for (let i = 0; i < this.board.length; i++) {
			if (i == toBeRemovedIndex) {
				cells[i].classList.value = `cell ${this.board[i]} rm`;
			} else {
				cells[i].classList.value = `cell ${this.board[i]}`;
			}
		}

		this.isPlaying = false;
		setTimeout(() => {
			if (this.isWin == 0) this.isPlaying = true;
			else if (this.isWin == 1) alert("X has won!");
			else if (this.isWin == -1) alert("O has won!");
		}, 50);
	}
}

const game = new Game(cells);
game.startNewGame();
