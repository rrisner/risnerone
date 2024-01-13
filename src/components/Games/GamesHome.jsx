import "../../App.css";

function GamesHome() {
  return (
    <>
      <h1>Games</h1>
      <p>Check out these games!</p>
      <div className="games-menu">
        <ul>
          <li>
            <a href="/games/guess-the-number">Guess the Number</a>
          </li>
          <li>
            <a href="/games/mine-cleanup">Mine Cleanup</a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default GamesHome;
