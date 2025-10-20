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
        <nav>
            <div>
                <Link to="/">Home</Link>
            </div>
            <div>
                {user? (
                    <>
                        <span>Hello, {user.username}</span>
                        <Link to="/favorites">Favorites</Link>
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