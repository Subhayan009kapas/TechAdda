import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import "./Profile.css";
import PostModal from "../components/PostModal";

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const res = await fetch("https://techadda.onrender.com/api/posts/myposts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUserPosts(data);
      } catch (err) {
        console.error("Failed to fetch your posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user && token) {
      fetchUserPosts();
    }
  }, [user, token]);

  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(
        `https://techadda.onrender.com/api/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload();

      if (response.ok) {
        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== postId)
        );
      } else {
        console.error("Failed to delete post:", await response.json());
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const handleCreatePost = (newPost) => {
    setUserPosts((prev) => [newPost, ...prev]);
    setIsPostModalOpen(false); // close the modal after posting
  };

  if (!user) return <div className="profile-container">No user data.</div>;

  const stats = [
    { label: "Posts", value: userPosts.length },
    { label: "Following", value: "128" },
    { label: "Followers", value: "2.4K" },
  ];

  return (
    <div className="profile-container">
      {isPostModalOpen && (
        <PostModal
          onClose={() => setIsPostModalOpen(false)}
          onSubmit={handleCreatePost}
        />
      )}

      {/* Mobile Menu Button - Only visible on small screens */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <i className="icon-menu"></i>
      </button>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="avatar-container">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div className="online-indicator"></div>
        </div>

        <div className="profile-info">
          <div className="name-section">
            <h1>{user.name}</h1>
            <button className="edit-profile-btn">
              <i className="icon-edit"></i> Edit Profile
            </button>
          </div>

          <p className="user-email">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-mail"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
              <path d="M3 7l9 6l9 -6" />
            </svg>{" "}
            {user.email}
          </p>

          <div className="bio-section">
           <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-book"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" /><path d="M3 6l0 13" /><path d="M12 6l0 13" /><path d="M21 6l0 13" /></svg>
            <p>{user.bio || "No bio added. Tell others about yourself!"}</p>
          </div>

          <div className="stats-container">
            {stats.map((stat, index) => (
              <div className="stat-card" key={index}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className={`profile-navigation ${isMenuOpen ? "mobile-open" : ""}`}>
        <button
          className={`nav-item ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("posts");
            setIsMenuOpen(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-pencil-share"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
            <path d="M13.5 6.5l4 4" />
            <path d="M16 22l5 -5" />
            <path d="M21 21.5v-4.5h-4.5" />
          </svg>{" "}
          Posts
        </button>
        <button
          className={`nav-item ${activeTab === "media" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("media");
            setIsMenuOpen(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-photo-scan"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 8h.01" />
            <path d="M6 13l2.644 -2.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" />
            <path d="M13 13l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l1.644 1.644" />
            <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
            <path d="M4 16v2a2 2 0 0 0 2 2h2" />
            <path d="M16 4h2a2 2 0 0 1 2 2v2" />
            <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
          </svg>{" "}
          Media
        </button>
      </div>

      {/* Tab Content */}
      <div className="content-section">
        {activeTab === "posts" && (
          <>
            <h3 className="section-title">Your Posts</h3>

            {loading ? (
              <div className="posts-grid">
                {[1, 2, 3].map((i) => (
                  <div className="post-skeleton" key={i}>
                    <div className="skeleton-header"></div>
                    <div className="skeleton-content"></div>
                    <div className="skeleton-content"></div>
                    <div className="skeleton-footer"></div>
                  </div>
                ))}
              </div>
            ) : userPosts.length === 0 ? (
              <div className="empty-state">
                <i className="icon-empty-posts"></i>
                <h4>No posts yet</h4>
              </div>
            ) : (
              <div className="posts-grid">
                {userPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onDeleteSuccess={() => handleDeletePost(post._id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "media" && (
          <div className="empty-state">
           <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-photo-scan"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 8h.01" />
            <path d="M6 13l2.644 -2.644a1.21 1.21 0 0 1 1.712 0l3.644 3.644" />
            <path d="M13 13l1.644 -1.644a1.21 1.21 0 0 1 1.712 0l1.644 1.644" />
            <path d="M4 8v-2a2 2 0 0 1 2 -2h2" />
            <path d="M4 16v2a2 2 0 0 0 2 2h2" />
            <path d="M16 4h2a2 2 0 0 1 2 2v2" />
            <path d="M16 20h2a2 2 0 0 0 2 -2v-2" />
          </svg>{" "}
            <h4>No media yet</h4>
            <p>You haven't uploaded any photos or videos</p>
          </div>
        )}

        {activeTab === "likes" && (
          <div className="empty-state">
            <i className="icon-likes"></i>
            <h4>No liked content</h4>
            <p>Posts you like will appear here</p>
          </div>
        )}

        {activeTab === "bookmarks" && (
          <div className="empty-state">
            <i className="icon-bookmarks"></i>
            <h4>No bookmarks yet</h4>
            <p>Save posts to easily find them later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
