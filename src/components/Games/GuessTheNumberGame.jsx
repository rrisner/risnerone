import "../../App.css";
import { useState, useEffect, useRef } from "react";

function GuessTheNumberGame() {
  const [randomNumber, setRandomNumber] = useState(0);
  const [gameState, setGameState] = useState("playing");
  const [guessCount, setGuessCount] = useState(0);
  const usersGuess = useRef(-1);

  const setNewRandomNumber = () => {
    setRandomNumber(Math.floor(Math.random() * 100));
  };

  useEffect(() => {
    setNewRandomNumber();
  }, []);

  const checkUserGuessNumber = (guess) => {
    guess = Number(guess); //coerce to number type
    //console.log(`${guess} vs. ${randomNumber} ? is ${guess === randomNumber}`);

    setGuessCount(guessCount + 1);

    if (guess === randomNumber) {
      setGameState("win");
    } else if (guess < randomNumber) {
      setGameState("guess-low");
    } else {
      setGameState("guess-high");
    }
  };

  const clickedSubmitButton = (e) => {
    e.preventDefault();
    //console.log(usersGuess.current.value);
    if (usersGuess.current.value === "") {
      setGameState("no-value-entered");
    } else {
      checkUserGuessNumber(usersGuess.current.value);
    }
  };

  const playAgain = () => {
    setGameState("playing");
    setNewRandomNumber();
    setGuessCount(0);
  };

  return (
    <>
      <h1>Guess the Number</h1>
      <h2>Please guess an integer between 0 and 99:</h2>
      {gameState != "win" && (
        <>
          <input type="number" step={1} ref={usersGuess}></input>
          <button onClick={clickedSubmitButton}>Submit Guess</button>
        </>
      )}

      {gameState === "win" && <h3>You won in {guessCount} guesses.</h3>}
      {gameState != "win" && <h3>Guesses so far: {guessCount}</h3>}

      {(gameState === "win" && (
        <div>
          <h2>You won! The number was {randomNumber}!</h2>
          <button onClick={playAgain}>Play again!</button>
        </div>
      )) ||
        (gameState === "guess-low" && (
          <div>
            <h2>Your guess was too low!</h2>
          </div>
        )) ||
        (gameState === "guess-high" && (
          <div>
            <h2>Your guess was too high!</h2>
          </div>
        )) ||
        (gameState === "no-value-entered" && (
          <div>
            <h2>No value was entered.</h2>
          </div>
        ))}
      <p>Page added January 11, 2024</p>
    </>
  );
}

export default GuessTheNumberGame;
