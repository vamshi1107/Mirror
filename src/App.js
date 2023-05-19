import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Home from "./components/home/home";
import AppState from "./context/appState";

function App() {
  return (
    <>
      <AppState>
        <Routes>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/signup" element={<Signup></Signup>}></Route>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/:id" element={<Home></Home>}></Route>
        </Routes>
      </AppState>
    </>
  );
}

export default App;
