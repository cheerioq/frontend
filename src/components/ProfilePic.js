import React, { useState, useEffect, useRef } from "react";

export default function ProfilePic({ changeprofile }) {
  const hiddenFileinput = useRef(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  // Posting data to Cloudinary
  const postdetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "razitech");
    return fetch("https://api.cloudinary.com/v1_1/razitech/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setUrl(data.url);
          console.log(data.url);
        } else {
          throw new Error("Error uploading image to Cloudinary");
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // Saving post to MongoDB
  const postPic = () => {
    if (!url) {
      setError("No image URL available to post to MongoDB");
      return;
    }
    fetch("http://localhost:5000/uploadProfilePic", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        changeprofile();
        window.location.reload();
      })
      .catch((err) => setError(err.message));
  };

  const handleClick = () => {
    hiddenFileinput.current.click();
  };

  useEffect(() => {
    if (image) {
      postdetails();
    }
  }, [image]);

  useEffect(() => {
    if (url) {
      postPic();
    }
  }, [url, changeprofile]);

  return (
    <div
      className="ProfilePic darkBg"
      style={{
        textAlign: "center",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {error && <div className="error-message">{error}</div>}
      <div
        className="changePic centered "
        style={{
          background: "linear-gradient(45deg, #FF6B6B, #FFE66D)",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid #FF6B6B",
        }}
      >
        <div>
          <h2>Change profile photo</h2>
        </div>
        <div style={{ borderTop: "1px solid #00000030", marginTop: "20px" }}>
          <button
            className="upload-btn"
            style={{
              color: "#1EA1F7",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "1px solid #1EA1F7",
              backgroundColor: "transparent",
              cursor: "pointer",
            }}
            onClick={handleClick}
          >
            Upload photo
          </button>
          <input
            type="file"
            ref={hiddenFileinput}
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
            style={{ display: "none" }}
            name=""
            id=""
          />
        </div>
        <div style={{ borderTop: "1px solid #00000030", marginTop: "20px" }}>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#777",
              textDecoration: "underline",
              fontSize: "16px",
            }}
            onClick={changeprofile}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
