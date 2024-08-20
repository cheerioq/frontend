import React, { useState } from "react";
import logo from "../img/dostaan.png";
import "./signUp.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  //toast function
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  const emailregex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const passregex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{8,})/;

  const postData = () => {
    //checking email validation

    if (!emailregex.test(email)) {
      notifyA("invalid email");
      return;
    } else if (!passregex.test(password)) {
      notifyA(
        "At least one lowercase or uppercase letter,At least one digit,Minimum length of 8 characters"
      );
      return;
    }
    //sending to server
    fetch("http://localhost:5000/signUp", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        userName: userName,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          notifyA(data.error);
        } else {
          notifyB(data.message);
          navigate("/signIn");
        }

        console.log(data);
      });
  };

  return (
    <div className="signUp">
      <div className="form-container">
        <div className="form">
          <img className="signuplogo" src={logo} alt="" />
          <p className="loginPara">
            sign up to see photos and videos <br /> from your friends
          </p>
          <div>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="enter your email"
            />
          </div>
          <div>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              id="name"
              placeholder="full name"
            />
          </div>
          <div>
            <input
              type="text"
              name="userName"
              value={userName}
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              id="userName"
              placeholder="enter user name"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="enter your password"
            />
          </div>
          <p
            className="loginPara"
            style={{ fontSize: "12px", margin: "3px 0px" }}
          >
            By signing up, you agree to our terms and conditions
            <br /> privacy policy and cookies
          </p>
          <input
            type="submit"
            name=""
            id="submit-btn"
            value="signUp"
            onClick={() => {
              postData();
            }}
          />
        </div>
        <div className="form2">
          Already have an account?{" "}
          <Link to="/signIn">
            <span style={{ color: "blue", cursor: "pointer" }}> Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
