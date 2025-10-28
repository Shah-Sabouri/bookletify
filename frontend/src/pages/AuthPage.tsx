import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { loginUser, registerUser } from "../services/authApi";

const AuthPage: React.FC = () => {
    // LOGIN FORM STATE
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    // REGISTER FORM STATE
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerError, setRegisterError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    // LOGIN HANDLER
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(""); // clear previous error
        try {
            const { token, user } = await loginUser(loginUsername, loginPassword);
            login(token, user);
            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) setLoginError(err.message)
            else setLoginError("Invalid login credentials");
        }
    };

    // REGISTER HANDLER
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError("");
        try {
            const { token, user } = await registerUser(
                registerUsername,
                registerEmail,
                registerPassword
            );
            login(token, user);
            navigate("/");
        } catch (err: unknown) {
            if (err instanceof Error) setRegisterError(err.message);
            else setRegisterError("Registration failed");
        }
    };

    return (
        <div style={{ display: "flex", gap: "20px", maxWidth: "900px", margin: "40px auto" }}>
            
            {/* LOGIN CARD */}
            <div style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
                <h2>Login</h2>
                {loginError && <p style={{ color: "red" }}>{loginError}</p>}

                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={loginUsername}
                        onChange={(e) => {
                            setLoginUsername(e.target.value);
                            setLoginError("");
                        }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={(e) => {
                            setLoginPassword(e.target.value);
                            setLoginError("");
                        }}
                        required
                    />
                    <button type="submit">Sign in</button>
                </form>
            </div>

            {/* REGISTER CARD */}
            <div style={{ flex: 1, padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
                <h2>Not a member? Join today!</h2>
                {registerError && <p style={{ color: "red" }}>{registerError}</p>}

                <form onSubmit={handleRegister}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={registerUsername}
                        onChange={(e) => {
                            setRegisterUsername(e.target.value);
                            setRegisterError("");
                        }}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={registerEmail}
                        onChange={(e) => {
                            setRegisterEmail(e.target.value);
                            setRegisterError("");
                        }}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) => {
                            setRegisterPassword(e.target.value);
                            setRegisterError("");
                        }}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
