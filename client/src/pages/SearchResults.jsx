// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import "./SearchResults.css";
// const SearchResults = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const query = new URLSearchParams(useLocation().search).get("q");

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//        const res = await fetch("http://localhost:5000/api/users", {
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

//         const data = await res.json();

//         // Filter users by name or email
//         const filtered = data.filter((user) =>
//           user.name.toLowerCase().includes(query.toLowerCase()) ||
//           user.email.toLowerCase().includes(query.toLowerCase())
//         );

//         setUsers(filtered);
//       } catch (err) {
//         console.error("Failed to search users:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (query) fetchUsers();
//   }, [query]);

//   return (
//     <div className="search-results">
//       <h2>🔍 User search results for: "{query}"</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         users.map((user) => (
//           <div key={user._id} className="user-result-card">
//             <img
//               src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${user.name}`}
//               alt="avatar"
//               className="avatar"
//               style={{ width: 40, height: 40 }}
//             />
//             <div style={{ marginLeft: 10 }}>
//               <h4>{user.name}</h4>
//               <p>{user.email}</p>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default SearchResults;


import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import "./SearchResults.css";
import { FiUser, FiFileText, FiSearch } from "react-icons/fi";

const SearchResults = () => {
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const query = new URLSearchParams(useLocation().search).get("q");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        // Fetch both users and posts in parallel
        const [usersRes, postsRes] = await Promise.all([
          fetch(`https://techadda.onrender.com/api/users?q=${query}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          fetch(`https://techadda.onrender.com/api/posts/search?q=${query}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
        ]);

        const usersData = await usersRes.json();
        const postsData = await postsRes.json();

        setResults({
          users: usersData,
          posts: postsData
        });
      } catch (err) {
        console.error("Failed to search:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const renderResultsCount = () => {
    const userCount = results.users.length;
    const postCount = results.posts.length;
    const totalCount = userCount + postCount;
    
    if (loading) return null;
    
    return (
      <div className="results-count">
        Found {totalCount} {totalCount === 1 ? "result" : "results"} for "{query}"
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loader-container">
          <Loader />
        </div>
      );
    }

    const showUsers = ["all", "users"].includes(activeTab) && results.users.length > 0;
    const showPosts = ["all", "posts"].includes(activeTab) && results.posts.length > 0;

    if (!showUsers && !showPosts) {
      return (
        <div className="no-results">
          <FiSearch size={48} />
          <h3>No results found</h3>
          <p>Try different keywords or check your spelling</p>
        </div>
      );
    }

    return (
      <>
        {showUsers && (
          <div className="results-section">
            <h3 className="section-title">
              <FiUser className="section-icon" />
              Users ({results.users.length})
            </h3>
            <div className="users-grid">
              {results.users.map((user) => (
                <div 
                  key={user._id} 
                  className="user-card"
                  onClick={() => navigate(`/profile/${user._id}`)}
                >
                  <div className="user-avatar">
                    <img
                      src={`https://api.dicebear.com/7.x/personas/svg?seed=${user.email}`}
                      alt={user.name}
                    />
                  </div>
                  <div className="user-info">
                    <h4>{user.name}</h4>
                  
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showPosts && (
          <div className="results-section">
            <h3 className="section-title">
              <FiFileText className="section-icon" />
              Posts ({results.posts.length})
            </h3>
            <div className="posts-grid">
              {results.posts.map((post) => (
                <PostCard 
                  key={post._id} 
                  post={post}
                  condensed={true}
                />
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <h2>Search Results</h2>
        {renderResultsCount()}
      </div>

      <div className="results-tabs">
        <button 
          className={activeTab === "all" ? "active" : ""}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button 
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        <button 
          className={activeTab === "posts" ? "active" : ""}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
      </div>

      {renderContent()}
    </div>
  );
};

export default SearchResults;