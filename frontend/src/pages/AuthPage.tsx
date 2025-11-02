import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginUser, registerUser } from "../services/authApi";
import styles from "./AuthPage.module.css";

const AuthPage: React.FC = () => {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [registerUsername, setRegisterUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerError, setRegisterError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        try {
            const { token, user } = await loginUser(loginUsername, loginPassword);
            login(token, user);
            navigate("/");
        } catch (err: unknown) {
            setLoginError(err instanceof Error ? err.message : "Invalid login credentials");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError("");
        try {
            const { token, user } = await registerUser(
                registerUsername, 
                registerEmail, 
                registerPassword);
            login(token, user);
            navigate("/");
        } catch (err: unknown) {
            setRegisterError(err instanceof Error ? err.message : "Registration failed");
        }
    };

    return (
        <div className={styles.container}>
            {/* LOGIN */}
            <div className={styles.card}>
                <h2>Login</h2>
                {loginError && <p className={styles.error}>{loginError}</p>}
                <form onSubmit={handleLogin} className={styles.form}>
                    <input
                    type="text"
                    placeholder="Username"
                    value={loginUsername}
                    onChange={(e) => (setLoginUsername(e.target.value), setLoginError(""))}
                    required
                    />
                    <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => (setLoginPassword(e.target.value), setLoginError(""))}
                    required
                    />
                    <button type="submit">Sign in</button>
                </form>
            </div>

            {/* REGISTER */}
            <div className={styles.card}>
                <h2>New here?</h2>
                <p className={styles.subText}>Create an account to start rating and saving albums.</p>
                {registerError && <p className={styles.error}>{registerError}</p>}
                <form onSubmit={handleRegister} className={styles.form}>
                    <input
                    type="text"
                    placeholder="Username"
                    value={registerUsername}
                    onChange={(e) => (setRegisterUsername(e.target.value), setRegisterError(""))}
                    required
                    />
                    <input
                    type="email"
                    placeholder="Email"
                    value={registerEmail}
                    onChange={(e) => (setRegisterEmail(e.target.value), setRegisterError(""))}
                    required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => (setRegisterPassword(e.target.value), setRegisterError(""))}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
