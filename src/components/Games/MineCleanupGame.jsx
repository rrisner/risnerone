import { useEffect, useState } from "react";
import "../../App.css";
import "./GamesExtendedStyles/MineCleanupGame.css";

class GameBoardTile {
  IsAMine = false;
  IsRevealed = false;
  FlagIsSet = false;
  AdjacentMineCount = 0;
  Coordinates;

  constructor(rowNumber, columnNumber, probabilityOfBeingAMine) {
    this.Coordinates = {
      rowNumber: rowNumber,
      columnNumber: columnNumber,
    };

    const randomNumber = Math.random();
    if (randomNumber <= probabilityOfBeingAMine) {
      this.IsAMine = true;
    }
  }

  copyStateFrom(analogousElement) {
    this.IsAMine = analogousElement.IsAMine;
    this.IsRevealed = analogousElement.IsRevealed;
    this.AdjacentMineCount = analogousElement.AdjacentMineCount;
    this.FlagIsSet = analogousElement.FlagIsSet;
  }

  getDisplayVisualization(globalGameState) {
    if (this.IsAMine && this.IsRevealed) {
      return "💥";
    } else if (!this.IsAMine && this.IsRevealed) {
      if (this.AdjacentMineCount == 0) {
        return "";
      } else {
        return this.AdjacentMineCount;
      }
    } else if (globalGameState == "game-win" && this.IsAMine) {
      return "%";
    } else {
      return "";
    }
  }

  getDisplayElement(
    getMainGameBoardState,
    updateMainGameBoardState,
    globalGameState
  ) {
    return (
      <td
        className={`mine-cleanup-tile-${this.IsRevealed}${
          this.IsRevealed ? (this.IsAMine ? "-mine" : "-nomine") : ""
        }${
          globalGameState != "playing" || this.IsRevealed
            ? " noclick"
            : " click"
        }`}
        onClick={(e) =>
          globalGameState === "playing" &&
          (this.FlagIsSet
            ? this.setFlag(e, getMainGameBoardState, updateMainGameBoardState)
            : this.revealCellWithPropagation(
                e,
                getMainGameBoardState,
                updateMainGameBoardState
              ))
        }
        key={(this.Coordinates.rowNumber, this.Coordinates.columnNumber)}
      >
        {!this.IsRevealed && (
          <div
            className={`optional-${this.FlagIsSet ? "remove" : "place"}-flag`}
            onClick={(e) =>
              globalGameState === "playing" &&
              this.setFlag(e, getMainGameBoardState, updateMainGameBoardState)
            }
          >
            🚩
          </div>
        )}
        {this.getDisplayVisualization(globalGameState)}
      </td>
    );
  }

  getAdjacentMineCountFor(cellRow, cellColumn, temporaryGameBoard) {
    let mineCount = 0;
    for (
      let i = Math.max(cellRow - 1, 0);
      i <= Math.min(cellRow + 1, temporaryGameBoard.length - 1);
      i++
    ) {
      for (
        let j = Math.max(cellColumn - 1, 0);
        j <= Math.min(cellColumn + 1, temporaryGameBoard[0].length - 1);
        j++
      ) {
        if (i === cellRow && j === cellColumn) {
          //console.log(`Cell r${i} c${j} generated the event.`);
          continue;
        } else {
          mineCount += temporaryGameBoard[i][j].IsAMine ? 1 : 0;
          /*console.log(
            `Checking position r${i} c${j} for mines: ${temporaryGameBoard[i][j].IsAMine}`
          );*/
        }
      }
    }
    return mineCount;
  }

  revealCellOnTemporaryGameBoard(cellRow, cellColumn, temporaryGameBoard) {
    temporaryGameBoard[cellRow][cellColumn].IsRevealed = true;
    const adjacentMineCount = this.getAdjacentMineCountFor(
      cellRow,
      cellColumn,
      temporaryGameBoard
    );
    temporaryGameBoard[cellRow][cellColumn].AdjacentMineCount =
      adjacentMineCount;

    if (adjacentMineCount === 0 && !this.IsAMine) {
      for (
        let i = Math.max(0, cellRow - 1);
        i <= Math.min(cellRow + 1, temporaryGameBoard.length - 1);
        i++
      ) {
        for (
          let j = Math.max(0, cellColumn - 1);
          j <= Math.min(cellColumn + 1, temporaryGameBoard[0].length - 1);
          j++
        ) {
          if (!temporaryGameBoard[i][j].IsRevealed) {
            this.revealCellOnTemporaryGameBoard(i, j, temporaryGameBoard);
          }
        }
      }
    } else {
      //Check if we get any neighboring 0s for free
      for (
        let i = Math.max(0, cellRow - 1);
        i <= Math.min(cellRow + 1, temporaryGameBoard.length - 1);
        i++
      ) {
        for (
          let j = Math.max(0, cellColumn - 1);
          j <= Math.min(cellColumn + 1, temporaryGameBoard[0].length - 1);
          j++
        ) {
          if (
            !temporaryGameBoard[i][j].IsRevealed &&
            !temporaryGameBoard[i][j].IsAMine &&
            !temporaryGameBoard[i][j].FlagIsSet
          ) {
            const neighborsAdjacentMines = this.getAdjacentMineCountFor(
              i,
              j,
              temporaryGameBoard
            );
            if (neighborsAdjacentMines === 0) {
              this.revealCellOnTemporaryGameBoard(i, j, temporaryGameBoard);
            }
          }
        }
      }
    }
  }

  revealCellWithPropagation(
    e,
    getMainGameBoardState,
    updateMainGameBoardState
  ) {
    console.log(e.target.className);
    if (e.target.className.includes("flag")) {
      //console.log(`Not for revealCell: ${e.target.className}`);
      return;
    }

    let gameBoardWithReveals = getMainGameBoardState();
    //console.log(gameBoardWithReveals);

    this.revealCellOnTemporaryGameBoard(
      this.Coordinates.rowNumber,
      this.Coordinates.columnNumber,
      gameBoardWithReveals
    );

    updateMainGameBoardState(gameBoardWithReveals);
  }

  setFlag(e, getMainGameBoardState, updateMainGameBoardState) {
    console.log(e.target.className);
    if (!e.target.className.includes("flag") && !this.FlagIsSet) {
      //console.log(`Not for setflag: ${e.target.className}`);
      return;
    }

    console.log("Setting flags");
    let gameBoardStateWithFlags = getMainGameBoardState();

    gameBoardStateWithFlags[this.Coordinates.rowNumber][
      this.Coordinates.columnNumber
    ].FlagIsSet =
      !gameBoardStateWithFlags[this.Coordinates.rowNumber][
        this.Coordinates.columnNumber
      ].FlagIsSet;

    updateMainGameBoardState(gameBoardStateWithFlags);
  }

  tryToPropagateReveal() {
    return;
  }
}

function MineCleanupGame() {
  const [gameBoardState, setGameBoardState] = useState(0);

  const initialGameState = {
    globalGameState: "playing",
    gameBoard: [],
    totalMineCount: 0,
    setFlagCount: 0,
  };

  const generateNewGameBoard = (probabilityOfBeingAMine) => {
    //console.log("Generating a new game board.");
    let newBoard = [];
    for (let i = 0; i < 10; i++) {
      let newRow = [];

      for (let j = 0; j < 10; j++) {
        newRow.push(new GameBoardTile(i, j, probabilityOfBeingAMine));
      }

      newBoard.push(newRow);
    }

    return newBoard;
  };

  const getMineCountFor = (gameBoard) => {
    let mineCount = 0;

    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[0].length; j++) {
        mineCount += gameBoard[i][j].IsAMine ? 1 : 0;
        /*console.log(
          `Checking for mines in r${i} c${j} : ${gameBoard[i][j].IsAMine} (${mineCount})`
        );*/
      }
    }

    return mineCount;
  };

  const initializeGameBoardState = () => {
    let newGameState = structuredClone(initialGameState);
    newGameState.gameBoard = generateNewGameBoard(0.22);
    newGameState.mineCount = getMineCountFor(newGameState.gameBoard);
    //console.log(newGameState.gameBoard);

    setGameBoardState(newGameState);
  };

  const checkForWinCondition = (gameBoard) => {
    let clearedTiles = 0;
    const maxAvailableTiles =
      gameBoard.length * gameBoard[0].length - gameBoardState.mineCount;
    let hasFailCondition = false;

    for (let i = 0; i < gameBoard.length; i++) {
      for (let j = 0; j < gameBoard[0].length; j++) {
        if (gameBoard[i][j].IsRevealed) {
          if (gameBoard[i][j].IsAMine) {
            hasFailCondition = true;
          } else {
            clearedTiles += 1;
          }
        }
      }
    }

    return !hasFailCondition && clearedTiles === maxAvailableTiles;
  };

  const updateMainGameBoardState = (newGameBoard) => {
    let gameOverConditionTriggered = false;
    let gameWinConditionTriggered = false;
    let newSetFlagCount = 0;

    let finalGameBoard = generateNewGameBoard(0);
    for (let i = 0; i < newGameBoard.length; i++) {
      for (let j = 0; j < newGameBoard[0].length; j++) {
        finalGameBoard[i][j].copyStateFrom(newGameBoard[i][j]);
        newSetFlagCount +=
          !finalGameBoard[i][j].IsRevealed && finalGameBoard[i][j].FlagIsSet
            ? 1
            : 0;
        gameOverConditionTriggered =
          gameOverConditionTriggered ||
          (newGameBoard[i][j].IsRevealed && newGameBoard[i][j].IsAMine);
      }
    }

    if (!gameOverConditionTriggered) {
      gameWinConditionTriggered = checkForWinCondition(finalGameBoard);
    }

    //console.log(`gameOverConditionTriggered? ${gameOverConditionTriggered}`);
    setGameBoardState({
      ...gameBoardState,
      globalGameState: gameOverConditionTriggered
        ? "game-over"
        : gameWinConditionTriggered
        ? "game-win"
        : gameBoardState.globalGameState,
      gameBoard: finalGameBoard,
      setFlagCount: newSetFlagCount,
    });
  };

  const getMainGameBoardState = () => {
    return structuredClone(gameBoardState?.gameBoard);
  };

  const resetGame = () => {
    initializeGameBoardState();
  };

  useEffect(() => {
    initializeGameBoardState();
  }, []);

  //console.log(gameBoardState.gameBoard);

  return (
    <>
      <h1>Mine Cleanup</h1>
      <h3>
        There are {gameBoardState.mineCount} mines in this game.{" "}
        {gameBoardState.setFlagCount}{" "}
        {gameBoardState.setFlagCount == 1 ? "flag is" : "flags are"} placed.
      </h3>
      <div className="mine-cleanup-game-board">
        <table>
          <tbody>
            {gameBoardState?.gameBoard?.map((row, rowIndex) => {
              return (
                <tr key={rowIndex}>
                  {row.map((cell) => {
                    return cell.getDisplayElement(
                      getMainGameBoardState,
                      updateMainGameBoardState,
                      gameBoardState.globalGameState
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {gameBoardState.globalGameState === "game-over" && (
        <h3 className="announcement-game-over">Game over!</h3>
      )}
      {gameBoardState.globalGameState === "game-win" && (
        <h3 className="announcement-game-win">Congratulations! You won!</h3>
      )}
      {gameBoardState.globalGameState != "playing" && (
        <button onClick={() => resetGame()}>Play Again</button>
      )}
    </>
  );
}

export default MineCleanupGame;
