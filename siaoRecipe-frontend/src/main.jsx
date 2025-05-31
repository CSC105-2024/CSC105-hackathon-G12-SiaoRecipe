import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

import Explore from "./pages/Explore.jsx";
import MyRecipe from "./pages/MyRecipe.jsx";
import Favorite from "./pages/Favorite.jsx";
import RecipeDetail from "./pages/RecipeDetail";
import UserSetting from "./pages/UserSetting.jsx";

import Sidebar from "./components/Sidebar.jsx";
import Home from "./pages/Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Sidebar />,
    children: [
      { path: "home", element: <Home /> },
      { path: "explore", element: <Explore /> },
      { path: "my-recipe", element: <MyRecipe /> },
      { path: "favorite", element: <Favorite /> },
      { path: "recipes/:id", element: <RecipeDetail /> },
      { path: "setting", element: <UserSetting /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
