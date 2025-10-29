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

    const userDashboardLink = user?.role === "admin" ? "/admin" : "/profile";

    return (
        <nav style={styles.nav}>
            {/* TOP BAR: LOGO + USER */}
            <div style={styles.topRow}>
                <Link to="/" style={styles.logo}>
                    🎵 Bookletify
                </Link>

                {user ? (
                    <div style={styles.userBox}>
                        <span style={{ marginRight: "6px" }}>Hello,</span>
                        <Link
                            to={userDashboardLink}
                            style={styles.username}
                        >
                            {user.username}
                        </Link>
                        <button onClick={handleLogout} style={styles.logout}>
                            Log out
                        </button>
                    </div>
                ) : (
                    <Link to="/auth">Login / Register</Link>
                )}
            </div>

            {/* SEARCH BAR */}
            <form onSubmit={handleSearch} style={styles.searchRow}>
                <input
                    type="text"
                    placeholder="Search albums…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.searchBtn}>
                    🔍
                </button>
            </form>
        </nav>
    );
};

const styles: Record<string, React.CSSProperties> = {
    nav: {
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    topRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    logo: {
        fontWeight: "bold",
        fontSize: "20px",
        textDecoration: "none",
        color: "#000",
    },

    userBox: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    username: {
        fontWeight: "700",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
    },

    logout: {
        cursor: "pointer",
        background: "none",
        border: "none",
        color: "red",
        fontWeight: "bold",
    },

    searchRow: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        gap: "8px",
    },

    input: {
        padding: "6px 10px",
        borderRadius: "5px",
        border: "1px solid #aaa",
        flex: 1,
        maxWidth: "350px",
        minWidth: "160px",
    },

    searchBtn: {
        padding: "6px 10px",
        backgroundColor: "#facc15",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "18px",
    },
};

export default Navbar;
