import "./App.css";
import appContext from "./context/appContext";
import { useContext } from "react";
import AppRouter from "./router/approuter";

function App() {
  const context = useContext(appContext);

  const isAuth = () => {
    return context?.data?.login || false;
  };

  return <div>{AppRouter(isAuth())}</div>;
}

export default App;
