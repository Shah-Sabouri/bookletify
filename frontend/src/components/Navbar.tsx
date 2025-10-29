import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setQuery("");
        setMenuOpen(false);
    };

    const userDashboardLink = user?.role === "admin" ? "/admin" : "/profile";

    return (
        <nav style={{
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #ccc",
            background: "#fff",
            position: "sticky",
            top: 0,
            zIndex: 999
        }}>
            
            {/* Logo */}
            <Link to="/" style={{ fontWeight: "bold", fontSize: "20px" }}>
                🎵 Bookletify
            </Link>

            {/* Hamburger (mobile) */}
            <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                    fontSize: "22px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: window.innerWidth <= 600 ? "block" : "none",
                }}
            >
                ☰
            </button>

            {/* Desktop + Mobile Menu */}
            <div
                style={{
                    display: window.innerWidth <= 600
                        ? (menuOpen ? "block" : "none")
                        : "flex",
                    alignItems: "center",
                    gap: "15px",
                    width: window.innerWidth <= 600 ? "100%" : "auto",
                    marginTop: window.innerWidth <= 600 ? "10px" : 0
                }}
            >
                {/* Search */}
                <form
                    onSubmit={handleSearch}
                    style={{
                        display: "flex",
                        gap: "8px",
                        width: window.innerWidth <= 600 ? "100%" : "auto"
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search albums..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            padding: "6px 10px",
                            borderRadius: "5px",
                            border: "1px solid #aaa",
                            width: window.innerWidth <= 600 ? "100%" : "200px",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "6px 10px",
                            backgroundColor: "#facc15",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "18px"
                        }}
                    >
                        🔍
                    </button>
                </form>

                {/* Auth & User */}
                {user ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ marginRight: "6px" }}>Hello,</span>
                        <Link 
                            to={userDashboardLink} 
                            style={{ 
                                fontWeight: "700",
                                textDecoration: "underline",
                                textUnderlineOffset: "3px"
                            }}
                        >
                            {user.username}
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{ cursor: "pointer", background: "none", border: "none", color: "red" }}
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <Link to="/auth">Login / Register</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
