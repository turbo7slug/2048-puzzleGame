let board;
let score = 0;
const rows = 4;
const columns = 4;
let previousBoard = null; 
window.onload = function () {
    setGame();
}

function setGame() {
    score = 0
    board=[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
    ]

    previousBoard=board;
    placeTwo();
    placeTwo();

    
    renderBoard();
}

function renderBoard() {
    const boardContainer = document.getElementById("board");
    boardContainer.innerHTML = "";
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < columns; ++c) {
            let tile = document.createElement("div");
            tile.id = r + "-" + c;
            updateTile(tile, board[r][c]);
            boardContainer.appendChild(tile);
        }
    }
    document.getElementById("score").innerText = score;
}

function hasEmptyTile() {
    return board.some(row => row.includes(0));
}

function placeTwo() {
    if (!hasEmptyTile()) return;
    let emptyTiles = [];
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < columns; ++c) {
            if (board[r][c] === 0) {
                emptyTiles.push({ r, c });
            }
        }
    }
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    board[randomTile.r][randomTile.c] = 2;
}

function updateTile(tile,num){
    tile.innerText = "";
    tile.classList.value="";
    tile.classList.add('tile');
    if(num>0){
        tile.innerText=num;
        if (num<=4096){
            tile.classList.add("x"+num.toString());
        }
        else{
            tile.classList.add('x8192');
        }
    }
 }

document.addEventListener('keyup', (e) => {
    const oldBoard = JSON.stringify(board);

    if (e.code === "ArrowLeft" && canSlide("left")) {
        slideLeft();
    } else if (e.code === "ArrowRight" && canSlide("right")) {
        slideRight();
    } else if (e.code === "ArrowUp" && canSlide("up")) {
        slideUp();
    } else if (e.code === "ArrowDown" && canSlide("down")) {
        slideDown();
    }

    const newBoard = JSON.stringify(board);

    if (oldBoard !== newBoard) {
        placeTwo();
        previousBoard = JSON.parse(oldBoard);
        checkWinCondition();
    } else {
        if (!hasAvailableMoves()) {
            openModal();
        }
    }

    renderBoard();
});

function canSlide(direction) {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < columns; ++c) {
            const currentValue = board[r][c];
            const adjacentValue = getAdjacentValue(direction, r, c);

            if (currentValue !== 0 && (adjacentValue === 0 || currentValue === adjacentValue)) {
                return true;
            }
        }
    }
    return false;
}

function getAdjacentValue(direction, r, c) {
    switch (direction) {
        case "left":
            return c > 0 ? board[r][c - 1] : 0;
        case "right":
            return c < columns - 1 ? board[r][c + 1] : 0;
        case "up":
            return r > 0 ? board[r - 1][c] : 0;
        case "down":
            return r < rows - 1 ? board[r + 1][c] : 0;
        default:
            return 0;
    }
}

function hasAvailableMoves() {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < columns; ++c) {
            const currentValue = board[r][c];
            
            // Check left
            if (c > 0 && (currentValue === 0 || currentValue === board[r][c - 1])) {
                return true;
            }

            // Check right
            if (c < columns - 1 && (currentValue === 0 || currentValue === board[r][c + 1])) {
                return true;
            }

            // Check up
            if (r > 0 && (currentValue === 0 || currentValue === board[r - 1][c])) {
                return true;
            }

            // Check down
            if (r < rows - 1 && (currentValue === 0 || currentValue === board[r + 1][c])) {
                return true;
            }
        }
    }

    return false;
}


function removeZeros(row) {
    return row.filter(num => num !== 0);
}

function slide(row) {
    row = removeZeros(row);
    for (let i = 0; i < row.length - 1; ++i) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = removeZeros(row);

    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; ++r) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
    }
}

function slideRight() {
    for (let r = 0; r < rows; ++r) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;
    }
}

function slideUp() {
    for (let c = 0; c < columns; ++c) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; ++r) {
            board[r][c] = row[r];
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; ++c) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; ++r) {
            board[r][c] = row[r];
        }
    }
}


function undoMove() {
    if (previousBoard) {
        board = previousBoard;
        previousBoard = null; 
        renderBoard();
    }
}


function openModal() {
    document.getElementById("modalScore").innerText = score;
    document.getElementById("myModal").style.display = "block";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
    setGame();
}


function openWinModal() {
    document.getElementById("winModal").style.display = "block";
}

function closeWinModal() {
    document.getElementById("winModal").style.display = "none";
    setGame(); // Reset the game after closing the win modal
}


function checkWinCondition() {
    for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < columns; ++c) {
            if (board[r][c] === 2048) {
               
                openWinModal();
            }
        }
    }
}