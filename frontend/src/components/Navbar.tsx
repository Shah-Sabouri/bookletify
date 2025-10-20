import React from "react";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav style={{ padding: "10px 20px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ccc"}}>
            <div>
                <Link to="/" style={{ marginRight: "15px" }}>Home</Link>
            </div>
            <div>
                {user? (
                    <>
                        <span style={{ marginRight: "15px" }}>Hello, {user.username}</span>
                        <Link to="/favorites" style={{ marginRight: "15px" }}>Favorites</Link>
                        <button onClick={handleLogout}>Log out</button>
                    </>
                ) : (
                    <Link to="/login">Login / Register</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;