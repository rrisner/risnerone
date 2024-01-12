import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {  createBrowserRouter,  RouterProvider,} from "react-router-dom";
import Home from './components/Home/home.jsx';
import About from './components/About/About.jsx';
import NavBar from './components/Global/NavBar.jsx';

const withHeaderAndFooter = (component) => {
  return (
    <>
      <NavBar />
      {component}
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: withHeaderAndFooter(<Home />)
  },
  {
    path: "/about",
    element: withHeaderAndFooter(<About />)
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
