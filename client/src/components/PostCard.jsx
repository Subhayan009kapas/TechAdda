import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FiTrash2, FiMoreVertical } from "react-icons/fi";
import "./PostCard.css";

const PostCard = ({ post, condensed = false, onDeleteSuccess }) => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const isAuthor = user && post.author?._id === user._id;
  const authorName = post.author?.name || "Unknown";
  const content = post.content || "(No content)";
  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const handleViewPost = () => {
    if (condensed) {
      navigate(`/post/${post._id}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`https://techadda.onrender.com/api/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete post");
      }

      onDeleteSuccess?.(post._id); // Call callback with ID if provided
    } catch (err) {
      console.error("Failed to delete post:", err.message);
      alert("You are not authorized to delete this post.");
    }
  };

  return (
    <div
      className={`post-card ${condensed ? "condensed" : ""}`}
      onClick={handleViewPost}
    >
      <div className="post-header">
        <div className="avatar">
          {authorName.charAt(0).toUpperCase()}
        </div>

        <div className="post-author">
          <h4>{authorName}</h4>
          <span>{createdAt}</span>
        </div>

        {!condensed && isAuthor && (
          <div className="post-actions">
            <button
              className="actions-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
              }}
            >
              <FiMoreVertical />
            </button>
            {showDropdown && (
              <div className="actions-dropdown">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                    setShowDropdown(false);
                  }}
                >
                  <FiTrash2 /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        <p>{content}</p>
      </div>
    </div>
  );
};

export default PostCard;
