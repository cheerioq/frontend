import React, { useState, useEffect } from "react";
import "./Createpost.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Createpost() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("../signUp");
    }
  }, []);
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const naviagte = useNavigate();

  //toast function
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    //saving post to mongodb
    if (url) {
      fetch("http://localhost:5000/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notifyA(data.error);
          } else {
            notifyB("sucessfully posted");
            naviagte("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [url]);

  // post imag eto cloudniary

  const postdetails = () => {
    // Check if body or image is empty
    if (!body || !image) {
      notifyA("Please fill both image and caption fields.");
      return;
    }

    console.log(body, image);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "razitech");
    fetch("https://api.cloudinary.com/v1_1/razitech/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setUrl(data.url);
        } else {
          notifyA("Failed to upload image.");
        }
      })
      .catch((err) => {
        notifyA("An error occurred while uploading the image.");
        console.log(err);
      });
  };

  const loadfile = (event) => {
    var output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function () {
      URL.revokeObjectURL(output.src);
    };
  };

  return (
    <div className="Createpost">
      <div className="post-header">
        <h4 style={{ margin: "3px auto" }}>Create new post</h4>
      </div>
      <div className="main-div">
        <img
          id="output"
          src="https://cdn.icon-icons.com/icons2/510/PNG/512/image_icon-icons.com_50366.png"
          alt=""
        />
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            loadfile(event);
            setImage(event.target.files[0]);
          }}
        />
      </div>
      <div className="details">
        <div className="card-header">
          <div className="card-pic"></div>
        </div>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
          type="text"
          placeholder="write a caption"
        ></textarea>
      </div>
      <button
        id="post-btn"
        onClick={() => {
          postdetails();
        }}
      >
        POST
      </button>
    </div>
  );
}
