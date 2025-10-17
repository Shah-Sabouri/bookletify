// src/pages/AuthPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginUser, registerUser } from "../services/authApi";

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                const { token, user } = await loginUser(username, password);
                login(token, user);
                navigate("/"); // redirect after login
            } else {
                const { token, user } = await registerUser(username, email, password);
                login(token, user);
                navigate("/");
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
        <h2>{isLogin ? "Logga in" : "Registrera dig"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
            {!isLogin && (
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            )}
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button type="submit">{isLogin ? "Logga in" : "Registrera"}</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
            <p style={{ marginTop: "15px" }}>
                {isLogin ? "Har du inget konto?" : "Har du redan ett konto?"}{" "}
                <span
                onClick={() => setIsLogin(!isLogin)}
                style={{ color: "#007bff", cursor: "pointer" }}
                >
                    {isLogin ? "Registrera dig här" : "Logga in här"}
                </span>
            </p>
        </div>
    );
};

export default AuthPage;
