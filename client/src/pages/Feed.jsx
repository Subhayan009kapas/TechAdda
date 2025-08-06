import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import Notification from "../components/Notification";
import PostModal from "../components/PostModal";
import "./Feed.css";
import { FiEdit } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const Feed = () => {
  const { user, token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q");

  // ✅ Fetch posts available globally
  const fetchPosts = async () => {
    setLoading(true); // In case it's a reload after post/delete
    try {
      const endpoint = query
        ? `http://localhost:5000/api/posts/search-by-author?q=${query}`
        : "http://localhost:5000/api/posts";

      const res = await fetch(endpoint);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Trigger fetch on query change
  useEffect(() => {
    fetchPosts();
  }, [query]);

  const handlePostSubmit = async (content) => {
    if (!content.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Post failed:", error);
        return;
      }

      setShowModal(false);
      showNotification("Post created successfully!", "success");
      fetchPosts(); // ✅ This now works because it's globally scoped
    } catch (err) {
      console.error("Failed to post", err);
      showNotification("Failed to create post", "error");
    }
  };

  const handleDeleteSuccess = () => {
    fetchPosts(); // ✅ Now accessible
    showNotification("Post deleted successfully!", "success");
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  return (
    <div className="feed-container">
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}

      <div className="feed-header">
        <h2>News Feed</h2>
        {user && (
          <button className="create-post-btn" onClick={() => setShowModal(true)}>
            <FiEdit className="edit-icon" />
            <span>Create Post</span>
          </button>
        )}
      </div>

      {showModal && (
        <PostModal
          onSubmit={handlePostSubmit}
          onClose={() => setShowModal(false)}
        />
      )}

      {loading ? (
        <div className="loader-container">
          <Loader />
        </div>
      ) : posts.length === 0 ? (
        <div className="empty-feed">
          <img src="/empty-feed.svg" alt="Empty feed" />
          <h3>No posts yet</h3>
          <p>Be the first to share your thoughts!</p>
          <button onClick={() => setShowModal(true)}>Create Post</button>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDeleteSuccess={handleDeleteSuccess}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;
