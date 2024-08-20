import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import UserProfilevt from "./UserProfilevt";

export default function UserProfile() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  const { userid } = useParams();
  const [isFollow, setIsFollow] = useState(false);
  const [user, setUser] = useState("");
  const [posts, setPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // State for the selected post

  // Function to toggle post details
  const toggleDetails = (selectedPost) => {
    setShow(!show);
    setSelectedPost(selectedPost);
  };

  // to follow user
  const followUser = (userId) => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setIsFollow(true);
      });
  };

  // to unfollow user
  const unfollowUser = (userId) => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        console.log(data);
        setIsFollow(false);
      });
  };

  useEffect(() => {
    fetch(`http://localhost:5000/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUser(result.user);
        setPosts(result.post);
        if (
          result.user.followers &&
          result.user.followers.includes(
            JSON.parse(localStorage.getItem("user"))._id
          )
        ) {
          setIsFollow(true);
        }
      });
  }, [isFollow, userid]);

  return (
    <div
      className="profile"
      style={{ maxWidth: "600px", width: "100%", margin: "80px auto" }}
    >
      {/* Profile frame */}
      <div
        className="profile-frame"
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        {/* Profile picture */}
        <div className="profile-pic-container">
          <img
            className="profile-pic"
            src={user.Photo ? user.Photo : picLink}
            alt=""
            style={{
              borderRadius: "50%",
              border: "3px solid #fff",
              width: "100px",
              height: "100px",
            }}
          />
        </div>
        {/* Profile data */}
        <div
          className="profile-data"
          style={{
            marginLeft: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              marginBottom: "10px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            {user.name}
          </h1>
          <button
            className="followBtn"
            style={{
              backgroundColor: isFollow ? "#ff5a5f" : "#3897f0",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
            onClick={() => {
              if (isFollow) {
                unfollowUser(user._id);
              } else {
                followUser(user._id);
              }
            }}
          >
            {isFollow ? "Unfollow" : "Follow"}
          </button>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p
              style={{ marginRight: "20px", fontWeight: "bold", color: "#666" }}
            >
              {Array.isArray(posts) ? posts.length : 0} posts
            </p>
            <p
              style={{ marginRight: "20px", fontWeight: "bold", color: "#666" }}
            >
              {user.followers ? user.followers.length : "0"} following
            </p>
            <p style={{ fontWeight: "bold", color: "#666" }}>
              {user.following ? user.following.length : "0"} followers
            </p>
          </div>
        </div>
      </div>
      <hr style={{ width: "90%", opacity: "0.8", margin: "25px auto" }} />
      {/* Gallery */}
      <div
        className="gallery"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
          gap: "10px",
        }}
      >
        {Array.isArray(posts) &&
          posts.map((pics) => (
            <img
              key={pics._id}
              src={pics.photo}
              onClick={() => toggleDetails(pics)}
              alt=""
              style={{
                width: "100%",
                height: "auto",
                cursor: "pointer",
                transition: "transform 0.3s ease",
              }}
              className="item"
            />
          ))}
      </div>
      {show && (
        <UserProfilevt item={selectedPost} toggleDetails={toggleDetails} />
      )}
    </div>
  );
}
