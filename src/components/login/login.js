import "./login.css";
import { useRef, useEffect, useContext } from "react";
import * as Services from "../../services/services";
import { useNavigate } from "react-router-dom";
import appContext from "../../context/appContext";

const Login = () => {
  const email = useRef();
  const password = useRef();
  var navigate = useNavigate();
  const context = useContext(appContext);

  useEffect(() => {
    verify();
  }, [context.data]);

  const verify = () => {
    if (context.data.login) {
      navigate("/");
    }
  };

  const login = async (e, n) => {
    var u = email.current.value;
    var p = password.current.value;
    var res = await Services.loginUser(u, p);
    if (res?.current) {
      const data = context.data;
      const info = await Services.getUserInfo();
      context.updateData({ ...data, login: true, info: info });
      navigate("/");
    }
  };

  return (
    <>
      <div className="logwhole">
        <div className="logcard">
          <div className="lognm">
            Mirror | <span className="sp">Login</span>
          </div>
          <div className="loginputs">
            <input placeholder="Email" className="loginp" ref={email} />
            <input
              placeholder="Password"
              type="password"
              className="loginp"
              ref={password}
            />
            <button className="logbut" onClick={login}>
              Login
            </button>
            <div className="signtext">
              Not a member <a href="signup">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
