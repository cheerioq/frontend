import React, { useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// import { posts } from '../../../backend/routes/createPost';

export default function Home() {
  var picLink = "https://cdn-icons-png.flaticon.com/128/3177/3177440.png";
  // Capitalized the component name

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [comment, setComment] = useState("");
  const [show, setShow] = useState(false);
  const [item, setItem] = useState([]);

  // const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/signUp"); // Corrected the path
    }

    // fetch all post detail
    fetch("http://localhost:5000/allposts", {
      headers: {
        authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => setData(result))
      .catch((err) => console.log(err));
  }, []);
  // to show and hide comments

  const toggleComment = (posts) => {
    if (show) {
      setShow(false);
    } else {
      setShow(true);
      setItem(posts);
      console.log(item);
    }
  };

  const likepost = (id) => {
    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id, // Use the postId argument
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };

  const unlikepost = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        console.log(result);
      });
  };
  // this is functiom to make comment
  const makeComment = (text, id) => {
    fetch("http://localhost:5000/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text: text,
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((posts) => {
          if (posts._id === result._id) {
            return result;
          } else {
            return posts;
          }
        });
        setData(newData);
        setComment("");
        notifyB("comment posted");
        console.log(result);
      })
      .catch((error) => {
        console.error("Error making comment:", error);
      });
  };

  return (
    <div className="home">
      {/* card */}
      {data.map((posts) => {
        return (
          <div className="card" key={posts._id}>
            {/* card header */}
            <div className="card-header">
              <div className="card-pic">
                <img
                  src={
                    posts.postedBy && posts.postedBy.Photo
                      ? posts.postedBy.Photo
                      : picLink
                  }
                  alt=""
                />
              </div>
              <h5>
                {posts.postedBy && (
                  <Link to={`/profile/${posts.postedBy._id}`}>
                    {posts.postedBy.name}
                  </Link>
                )}
              </h5>
            </div>
            {/* card image */}
            <div className="card-image">
              <img src={posts.photo} alt="" />
            </div>
            {/* card-content */}
            <div className="card-content">
              {posts.likes.includes(
                JSON.parse(localStorage.getItem("user"))._id
              ) ? (
                <span
                  className="material-symbols-outlined material-symbols-outlined-red"
                  onClick={() => {
                    unlikepost(posts._id);
                  }}
                >
                  favorite
                </span>
              ) : (
                <span
                  className="material-symbols-outlined"
                  onClick={() => {
                    likepost(posts._id);
                  }}
                >
                  favorite
                </span>
              )}

              <p>{posts.likes.length} likes</p>
              <p>{posts.body}</p>
              <p
                style={{ fontWeight: "bold", cursor: "pointer" }}
                onClick={() => {
                  toggleComment(posts);
                }}
              >
                View all Comment
              </p>
            </div>
            {/* comment section */}
            <div className="add-comment">
              <span className="material-symbols-outlined">mood_bad</span>
              <input
                type="text"
                placeholder="add a comment"
                value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                name=""
                id=""
              />
              <button
                onClick={() => {
                  makeComment(comment, posts._id);
                }}
                className="comment"
              >
                post
              </button>
            </div>
          </div>
        );
      })}
      {/* show comment */}
      {show && (
        <div className="showComment">
          <div className="container">
            <div className="postPic">
              <img src={item.photo} alt="" />
            </div>
            <div className="details">
              <div
                className="card-header"
                style={{ borderBottom: "1px solid #0000" }}
              >
                <div className="card-pic">
                  <img
                    src="https://images.unsplash.com/photo-1690301458653-915ac42be8ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=379&q=80"
                    alt=""
                  />
                </div>
                <h5>
                  {" "}
                  <Link to={`/profile/${item.postedBy._id}`}></Link>
                  {item.postedBy.name}
                </h5>
              </div>
              {/* commentSection */}
              <div
                className="comment-section"
                style={{ borderBottom: "1px solid #0000" }}
              >
                {item.comments.map((comment) => {
                  return (
                    <p className="comm">
                      <span
                        className="commenter"
                        style={{ fontWeight: "bolder" }}
                      >
                        {comment.postedBy.name}{" "}
                      </span>
                      <span className="commentText">{comment.comment} </span>
                    </p>
                  );
                })}
              </div>
              {/* card-content */}
              <div className="card-content">
                <p>{item.likes.length}likes</p>
                <p>{item.body}</p>
              </div>
              {/* comment section */}
              <div className="add-comment">
                <span className="material-symbols-outlined">mood_bad</span>
                <input
                  type="text"
                  placeholder="add a comment"
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  name=""
                  id=""
                />
                {
                  <button
                    onClick={() => {
                      makeComment(comment, item._id);
                      toggleComment();
                    }}
                    className="comment"
                  >
                    post
                  </button>
                }
              </div>
            </div>
          </div>
          <div className="close-comment" onClick={toggleComment}>
            <span className="material-symbols-outlined material-symbols-outlined-comment">
              close
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
