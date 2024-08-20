import React, { useContext } from "react";
import logo from "../img/dostaan.png";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { LoginContext } from "../context/logonContext";

export default function Navbar({ login }) {
  const { setModalOpen, signIn, signUp } = useContext(LoginContext);

  const loginStatus = () => {
    const token = localStorage.getItem("jwt");
    if (login || token) {
      return (
        <>
          <Link to="/profile">
            <li>Profile</li>
          </Link>
          <Link to="/createPost">Create Post</Link>
          <button
            className="primaryBtn"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Log Out
          </button>
        </>
      );
    } else {
      return (
        <>
          <Link to="/signUp">
            <li>{signUp}</li>
          </Link>
          <Link to="/signIn">
            <li>{signIn}</li>
          </Link>
        </>
      );
    }
  };

  return (
    <div className="navbar">
      <Link to={`/`}>
        <img src={logo} alt="" />
      </Link>

      <ul className="nav-menu">{loginStatus()}</ul>
    </div>
  );
}
