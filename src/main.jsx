import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home/home.jsx";
import About from "./components/About/About.jsx";
import NavBar from "./components/Global/NavBar.jsx";
import GuessTheNumberGame from "./components/Games/GuessTheNumberGame.jsx";
import GamesHome from "./components/Games/GamesHome.jsx";
import BackToGamesLink from "./components/Games/BackToGamesLink.jsx";

const withHeaderAndFooter = (component) => {
  return (
    <>
      <NavBar />
      {component}
    </>
  );
};
const withBackToGamesLink = (component) => {
  return (
    <>
      {component}
      <BackToGamesLink />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: withHeaderAndFooter(<Home />),
  },
  {
    path: "/about",
    element: withHeaderAndFooter(<About />),
  },
  {
    path: "/games",
    element: withHeaderAndFooter(<GamesHome />),
  },
  {
    path: "/games/guess-the-number",
    element: withHeaderAndFooter(withBackToGamesLink(<GuessTheNumberGame />)),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
