import { Navigate, useRoutes } from "react-router-dom";
import Login from "../components/login/login";
import Signup from "../components/signup/signup";
import Account from "../components/account/account";
import Editor from "../components/editor/editor";

const getRoutes = (islogged) => [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "",
    element: <Navigate to={"/login"}/>,
  },
  {
    path: "/:id",
    element: <Account />,
  },
  {
    path: "/editor",
    element: <Editor />,
  },
];

const Router = (islogged) => useRoutes(getRoutes(islogged));

export default Router;
