import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

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
        <nav className={styles.nav}>
            <div className={styles.left}>
                <Link to="/" className={styles.logo}>
                🎵 Bookletify
                </Link>
            </div>
            
            <div className={styles.center}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <input
                    type="text"
                    placeholder="Search albums..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={styles.searchInput}
                />
                    <button type="submit" className={styles.searchBtn}>🔍</button>
                </form>
            </div>

            <div className={styles.right}>
                {user ? (
                <>
                    <span className={styles.hello}>Hello,</span>
                    <Link to={userDashboardLink} className={styles.username}>
                    {user.username}
                    </Link>
                    <button onClick={handleLogout} className={styles.logoutBtn}>
                    Log out
                    </button>
                </>
                ) : (
                <Link to="/auth" className={styles.authLink}>
                    Login / Register
                </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
