import { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";

interface User {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    createdAt: string;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await axiosClient.get("/admin/users");
                setUsers(res.data);
            } catch {
                console.warn("Retrying fetch users...");
                showToast("⚠️ Slow server, retrying...");
                setTimeout(fetchUsers, 1000);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user, navigate]);

    const handleRoleChange = async (id: string, role: "user" | "admin") => {
        const ok = window.confirm(`Change this user's role to ${role}?`);
        if (!ok) return;

        try {
            await axiosClient.put(`/admin/users/${id}/role`, { role });
            setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
            showToast(`✅ User set to ${role}`);
        } catch {
            showToast("⚠️ Failed to update role");
        }
    };

    const handleDelete = async (id: string) => {
        const ok = window.confirm("Are you sure you want to delete this user?");
        if (!ok) return;

        try {
            await axiosClient.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            showToast("🗑️ User deleted");
        } catch {
            showToast("⚠️ Failed to delete user");
        }
    };

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            {/* Toast */}
            {toast && (
                <div
                    style={{
                        position: "fixed",
                        top: "80px",
                        right: "20px",
                        background: "#333",
                        color: "#fff",
                        padding: "10px 15px",
                        borderRadius: "8px",
                        opacity: 0.95,
                        zIndex: 999,
                    }}
                >
                    {toast}
                </div>
            )}

            <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
                <h1 style={{ marginBottom: "20px" }}>Admin Dashboard</h1>

                {/* Admin Profile */}
                <div
                    style={{
                        padding: "20px",
                        marginBottom: "25px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        background: "#f9fafb",
                    }}
                >
                    <h2 style={{ marginBottom: "10px" }}>👑 Admin Profile</h2>
                    <p><strong>Username:</strong> {user?.username}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                </div>

                {/* Search */}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    style={{
                        padding: "8px",
                        width: "100%",
                        maxWidth: "300px",
                        marginBottom: "20px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                />

                {/* Loading indicator */}
                {loading ? (
                    <p style={{ fontStyle: "italic", color: "#555" }}>⏳ Loading users...</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ textAlign: "left", background: "#eee" }}>
                                <th style={{ padding: "8px" }}>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u._id} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td style={{ padding: "8px" }}>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                            value={u.role}
                                            onChange={(e) =>
                                                handleRoleChange(
                                                    u._id,
                                                    e.target.value as "user" | "admin"
                                                )
                                            }
                                            style={{ padding: "4px" }}
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            style={{
                                                background: "red",
                                                color: "#fff",
                                                border: "none",
                                                borderRadius: "50%",
                                                width: "24px",
                                                height: "24px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </>
    );
}
