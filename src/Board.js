import React, { useState, useEffect, useCallback } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.12 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    // Function to determine true or false based on probability
    function assignTrueWithProbability(probability) {
      // Generate a random number between 0 and 1
      const randomValue = Math.random();
      // Check if the random value is less than the probability
      if (randomValue < probability) {
        return true;
      } else {
        return false;
      }
    }

    return Array.from({ length: nrows }).map((row) =>
      Array.from({ length: ncols }).map((cell) =>
        assignTrueWithProbability(chanceLightStartsOn)
      )
    );
  }

  /** Deprecated code. Keeping for educational purposes.

  const hasWon = useCallback(() => {
    function allFalseValues(nestedArray) {
      return nestedArray.every((subArray) =>
        subArray.every((value) => value === false)
      );
    }

    const allFalse = allFalseValues(board);

    if (allFalse) {
      //TODO remove board and replace with "You Won!" message
      alert("won!");
    }
  }, [board]);

  useEffect(() => {
    hasWon();
  }, [board, hasWon]);
   * 
   */
  // Check if the game has been won
  function hasWon() {
    return board.every((row) => row.every((cell) => !cell));
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      // Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map((row) => [...row]);

      // in the copy, flip the selected cell and the cells around it

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      flipCell(y, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);

      return boardCopy;
    });
  }

  if (hasWon()) {
    return <div>You win!</div>;
  }

  let tblBoard = [];

  for (let y = 0; y < nrows; y++) {
    let row = [];
    for (let x = 0; x < ncols; x++) {
      let coord = `${y}-${x}`;
      row.push(
        <Cell
          key={coord}
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        ></Cell>
      );
    }
    tblBoard.push(<tr key={y}>{row}</tr>);
  }

  return (
    <table className="Board">
      <tbody> {tblBoard}</tbody>
    </table>
  );
}

export default Board;
