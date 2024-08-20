import React, { useState, useEffect } from "react";
import "./profile.css";
import ProfilePic from "./ProfilePic";
import PostDetail from "./PostDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const [pic, setPic] = useState([]);
  const [show, setShow] = useState(false);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState("");
  const [changePic, setChangePic] = useState(false);

  useEffect(() => {
    fetch(
      `http://localhost:5000/user/${
        JSON.parse(localStorage.getItem("user"))._id
      }`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setPic(result.post);
        setUser(result.user);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const toggleDetails = (posts) => {
    setShow(!show);
    setPosts(posts);
  };

  const changeprofile = () => {
    setChangePic(!changePic);
  };

  return (
    <div className="profile">
      <div className="profile-frame">
        <div className="profile-pic-container">
          <FontAwesomeIcon icon={faCamera} className="camera-icon" size="2x" />
          <img
            onClick={changeprofile}
            className="profile-pic"
            src={user.Photo ? user.Photo : picLink}
            alt="profile-pic"
          />
        </div>
        <div
          className="profile-data"
          style={{
            backgroundColor: "#f0f0f0",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ marginBottom: "10px", color: "#333" }}>
            {JSON.parse(localStorage.getItem("user")).name}
          </h1>
          <div
            className="profile-info"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <p style={{ color: "#555" }}>{pic ? pic.length : "0"} posts</p>
            <p style={{ color: "#555" }}>
              {user.followers ? user.followers.length : "0"} followers
            </p>
            <p style={{ color: "#555" }}>
              {user.following ? user.following.length : "0"} following
            </p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />
      <div className="gallery">
        {pic.map((pics) => (
          <img
            key={pics._id}
            src={pics.photo}
            onClick={() => toggleDetails(pics)}
            className="item"
            alt={`post-${pics._id}`}
          />
        ))}
      </div>
      {show && <PostDetail item={posts} toggleDetails={toggleDetails} />}
      {changePic && <ProfilePic changeprofile={changeprofile} />}
    </div>
  );
}
