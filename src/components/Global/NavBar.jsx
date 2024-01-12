import "../../App.css";
import { useLocation } from "react-router-dom";

function NavBar() {
  return (
    <div className="nav-bar">
      <ul>
        <li className={useLocation().pathname === "/" ? "active" : ""}>
          <a href="/">Home</a>
        </li>
        <li className={useLocation().pathname === "/about" ? "active" : ""}>
          <a href="/about">About</a>
        </li>
        <li className={useLocation().pathname.startsWith("/games") ? "active" : ""}>
          <a href="/games">Games</a>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
