'use strict';

function generateGrid(rootDivSelector, width, height) {
    const root = document.querySelector(rootDivSelector);
    const size = width * height;
    const grid = {
        width,
        height,
        squares: []
    };
    for(let position = 0; position < size; position++) {
        const div = document.createElement('square');
        div.style.width = '20px';
        div.style.border = '1px solid black';
        grid.squares.push({
            div,
            position,
        });
        root.appendChild(div);
    }
    return grid;
}

function colorSquares(path, squares, color) {
    squares.forEach(square => {
        if(path.includes(square.position)) {
            square.div.style.backgroundColor = color;
        }
    })
}

function setNewPosition(grid, clickedPosition) {

    const current = grid.squares.find(square => square.current);
    if(!current) throw new Error('current is not set');

    function walk(step, edgeFn) {

        function pathIsValid(newPosition) {
            return (!grid.squares[newPosition] || !grid.squares[newPosition].wall)&& edgeFn(newPosition)
                && (newPosition >= 0 || newPosition <= (grid.width * grid.height) - 1);
        }
        
        const path = [];
        let newPosition = current.position;
        while (true) {
            newPosition += step;
            console.log(newPosition)
            if(!pathIsValid(newPosition))
                break;
            path.push(newPosition);
        }
        console.log(path);
        return path.sort((a, b) => a - b);

    }

    function isSameRow(position) {
        return Math.floor(position / grid.width) === currentRow;
    }

    function isSameCol(position) {
        return position % grid.width === currentCol;
    }

    const currentRow = Math.floor(current.position / grid.width);
    const currentCol = current.position % grid.width;

    const clickedRow = Math.floor(clickedPosition / grid.width);
    const clickedCol = clickedPosition % grid.width;

    if (currentRow === clickedRow) {
        if (current.position > clickedPosition) {
            const newPath = walk(-1, isSameRow);
            colorSquares(newPath, grid.squares, 'lightgreen');
            current.div.style.backgroundColor = 'lightgreen';
            setCurrentPosition(grid, newPath[0]);
        } else {
            const newPath = walk(1, isSameRow);
            colorSquares(newPath, grid.squares, 'lightgreen');
            current.div.style.backgroundColor = 'lightgreen';
            setCurrentPosition(grid, newPath[newPath.length - 1]);
        }
        checkWin(grid);
    } else if (currentCol === clickedCol) {
        if(current.position > clickedPosition) {
            // go down
            const newPath = walk(-10, isSameCol);
            colorSquares(newPath, grid.squares, 'lightgreen');
            current.div.style.backgroundColor = 'lightgreen';
            setCurrentPosition(grid, newPath[0]);
        } else {
            // go up
            const newPath = walk(10, isSameCol);
            colorSquares(newPath, grid.squares, 'lightgreen');
            current.div.style.backgroundColor = 'lightgreen';
            setCurrentPosition(grid, newPath[newPath.length - 1]);
        }
        checkWin(grid);
    } else {
        // invalid movement
    }
}

function generateWall({ squares }, wallplot) {
    squares.forEach(square => {
        if(wallplot.includes(square.position)) {
            square.div.style.backgroundColor = 'black';
            square.wall = true;
        }
    });
}

function setCurrentPosition({ squares }, position) {
    const current = squares.find(square => square.position === position);
    if(current) {
        squares.forEach(square => square.current = false);
        current.div.style.backgroundColor = 'green';
        current.current = true;
    } else {
        throw new Error(`invalid position, current is: ${current}, position is: ${position}`);
    }
}

function setEventListeners(grid) {
    grid.squares.forEach(square => {
        if(square.wall || square.current) {
            square.div.removeEventListener('click', () => setNewPosition(grid, square.position));
        } else {
            square.div.addEventListener('click', () => setNewPosition(grid, square.position));
        }
    })
}

function checkWin({ squares }) {
    return squares.filter(square => !square.wall).every(square => square.filled);
}

const grid = generateGrid('.grid', 10, 10);
generateWall(grid, [1, 9, 90, 99]);
setCurrentPosition(grid, 37);
setEventListeners(grid);