document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const resetBtn = document.getElementById("resetBtn");
    const statusDisplay = document.getElementById("status");
    let currentPlayer = 1;
    let gameActive = true;
    let gameBoard = Array(6).fill().map(() => Array(7).fill(0));

    createBoard();

    function createBoard() {
        board.innerHTML = '';
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener("click", handleCellClick);
                board.appendChild(cell);
            }
        }
    }

    function handleCellClick(event) {
        const col = event.target.dataset.col;
        if (!gameActive) return;
        for (let row = 5; row >= 0; row--) {
            if (gameBoard[row][col] === 0) {
                gameBoard[row][col] = currentPlayer;
                const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
                cell.classList.add(`player${currentPlayer}`);
                if (checkWin(row, col)) {
                    statusDisplay.textContent = `Player ${currentPlayer} wins!`;
                    gameActive = false;
                } else if (gameBoard.flat().every(cell => cell !== 0)) {
                    statusDisplay.textContent = "It's a draw!";
                    gameActive = false;
                } else {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
                }
                return;
            }
        }
    }

    function checkWin(row, col) {
        const directions = [
            { dr: 0, dc: 1 },   // Horizontal
            { dr: 1, dc: 0 },   // Vertical
            { dr: 1, dc: 1 },   // Diagonal \
            { dr: 1, dc: -1 }   // Diagonal /
        ];

        for (let { dr, dc } of directions) {
            let count = 1 + countDirection(row, col, dr, dc) + countDirection(row, col, -dr, -dc);
            if (count >= 4) return true;
        }
        return false;
    }

    function countDirection(row, col, dr, dc) {
        let r = row + dr;
        let c = col + dc;
        let count = 0;
        while (r >= 0 && r < 6 && c >= 0 && c < 7 && gameBoard[r][c] === currentPlayer) {
            count++;
            r += dr;
            c += dc;
        }
        return count;
    }

    resetBtn.addEventListener("click", resetGame);

    function resetGame() {
        gameBoard = Array(6).fill().map(() => Array(7).fill(0));
        currentPlayer = 1;
        gameActive = true;
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
        createBoard();
    }

    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
});