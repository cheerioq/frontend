import React, { useState, useContext } from "react";
import "./signIn.css";
import logo from "../img/dostaan.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoginContext } from "../context/logonContext";

export default function SignIn() {
  const { setSignIn, setSignUp } = useContext(LoginContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailregex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  const postData = () => {
    if (!emailregex.test(email)) {
      notifyA("Invalid email");
      return;
    }

    fetch("http://localhost:5000/signIn", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB("Signed in successfully");
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/");
          setSignIn("");
          setSignUp("");
        }
        console.log(data);
      });
  };

  return (
    <div className="signin">
      <div className="loginForm">
        <img className="signuplogo" src={logo} alt="" />
        <div>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <input
          type="submit"
          name=""
          id="login-btn"
          onClick={postData}
          value="Sign In"
        />
      </div>
      <div className="loginForm2">
        Don't have an account?
        <Link to="/signUp">
          <span style={{ color: "#1773EA", cursor: "pointer" }}>Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
