import { useContext, useEffect, useState } from "react";
import { addUser } from "../../services/services";
import "./signup.css";
import { useNavigate } from "react-router-dom";
import appContext from "../../context/appContext";

const Signup = () => {
  const [user, setUser] = useState({});
  var navigate = useNavigate();
  const context = useContext(appContext);
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
    verify();
  }, [context.data]);

  const verify = () => {
    if (context.data.login) {
      navigate("/");
    }
  };

  const change = (e, n) => {
    var v = { ...user };
    v[n] = e.target.value;
    setUser({ ...v });
  };

  const add = async (e) => {
    const data = await addUser({ ...user });
    if (data?.["$id"]) {
      setError("");
      navigate("/login");
    }
    if (data?.error) {
      setError("User with same username or email already exists");
    }
  };

  return (
    <>
      <div className="signwhole">
        <div className="signcard">
          <div className="signnm">
            Mirror | <span className="sp">Signup</span>
          </div>
          <div className="sig-error">{error}</div>
          <div className="signupputs">
            <input
              placeholder="Name"
              className="signupp"
              name="name"
              onChange={(e) => change(e, "name")}
            />
            <input
              placeholder="Username"
              className="signupp"
              name="username"
              onChange={(e) => change(e, "username")}
            />
            <input
              placeholder="Password"
              type="password"
              className="signupp"
              name="password"
              onChange={(e) => change(e, "password")}
            />
            <input
              placeholder="Email"
              className="signupp"
              name="email"
              onChange={(e) => change(e, "email")}
            />
            <button className="signbut" onClick={add}>
              Create
            </button>
            <div className="signtext">
              Already a member <a href="login">Login</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
