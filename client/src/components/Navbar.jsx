import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";
import { FiSearch, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target) && isMobileSearchOpen) {
        setIsMobileSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileSearchOpen]);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);

      setSearchQuery("");
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1 className="logo" onClick={() => navigate("/")}>
          Tech<span>Adda</span>
        </h1>
      </div>

      <div 
        className={`search-container ${isMobileSearchOpen ? "mobile-search-active" : ""}`}
        ref={searchRef}
      >
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <FiSearch className="search-icon" />
          </button>
        </form>
      </div>

      <div className="navbar-actions">
        <button 
          className="mobile-search-toggle"
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
        >
          <FiSearch />
        </button>

        {user && (
          <div className="user-menu" ref={dropdownRef}>
            <button 
              className="avatar-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="User menu"
              aria-expanded={showDropdown}
            >
              <img
                src={`https://api.dicebear.com/7.x/personas/svg?seed=${user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                alt="avatar"
                className="avatar"
              />
            </button>
            
            <div className={`dropdown ${showDropdown ? "show" : ""}`}>
              <div className="user-info">
                <img
                  src={`https://api.dicebear.com/7.x/personas/svg?seed=${user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                  alt="avatar"
                  className="dropdown-avatar"
                />
                <div>
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
              </div>
              <button 
                onClick={() => navigate("/profile")}
                className="dropdown-item"
              >
                Profile
              </button>
              <button 
                onClick={handleLogout}
                className="dropdown-item logout-btn"
              >
                <FiLogOut className="logout-icon" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;