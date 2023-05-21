import { Navigate, useRoutes } from "react-router-dom";
import Home from "../components/home/home";
import Login from "../components/login/login";
import Signup from "../components/signup/signup";
import Account from "../components/account/account";

const getRoutes = (islogged) => [
  {
    path: "/",
    element: islogged ? <Home /> : <Navigate to="/login" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/:id",
    element: <Account />,
  },
];

const Router = (islogged) => useRoutes(getRoutes(islogged));

export default Router;
