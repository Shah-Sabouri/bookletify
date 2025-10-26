import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setQuery("");
    };

    return (
        <nav style={{
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
        }}
        >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link to="/" style={{ fontWeight: "bold", fontSize: "18px" }}>
            🎵 Bookletify
            </Link>

            <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
                <input
                type="text"
                placeholder="Search for albums..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    padding: "6px 10px",
                    borderRadius: "5px",
                    border: "1px solid #aaa",
                    width: "200px",
                }}
            />
            <button
                type="submit"
                style={{
                    padding: "6px 12px",
                    backgroundColor: "#facc15",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Search
            </button>
            </form>
        </div>

        <div>
            {user ? (
            <>
                <span style={{ marginRight: "15px" }}>Hello, {user.username}</span>
                <Link to="/profile" style={{ marginRight: "15px" }}>
                Profile
                </Link>
                <button onClick={handleLogout}>Log out</button>
            </>
            ) : (
            <Link to="/auth">Login / Register</Link>
            )}
        </div>
        </nav>
    );
};

export default Navbar;