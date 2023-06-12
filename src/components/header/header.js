import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import appContext from "../../context/appContext";
import "./header.css";
import { logoutUser } from "../../services/services";

const Header = (props) => {
  const navigate = useNavigate();

  const context = useContext(appContext);

  const logout = () => {
    const data = context.data;
    const res = logoutUser();
    context.updateData({ ...data, login: false, info: {} });
    navigate("/login");
  };

  const login = () => {
    navigate("/login");
  };

  const getUsername = () => {
    let username = context?.data?.info?.$id;
    return username || "";
  };

  return (
    <>
      <header>
        <div className="logocon">
          <a href="/">
            <div className="logo">Mirror</div>
          </a>
          <div id="greet">Greetings!</div>
        </div>
        <div className="menu">
          {context.data.login && (
            <>
              <a href={"/" + getUsername()}>
                <div className="menuitem m2">Profile</div>
              </a>
              <div className="menuitem m3" onClick={logout}>
                Logout
              </div>
            </>
          )}
          {!context.data.login && (
            <div className="menuitem m3" onClick={login}>
              Login
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
