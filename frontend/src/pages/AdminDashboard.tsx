import { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";

interface User {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
}

interface Review {
    _id: string;
    userId: {
        _id: string;
        username: string;
        email: string;
    } | string;
    albumId?: string;
    rating: number;
    comment?: string;
    title?: string;
    coverUrl?: string;
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const [usersVisible, setUsersVisible] = useState(true);
    const [reviewsVisible, setReviewsVisible] = useState(true);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    useEffect(() => {
        if (!user || user.role !== "admin") {
        navigate("/");
        return;
        }

        const fetchData = async () => {
        try {
            setLoading(true);

            const [usersRes, reviewsRes] = await Promise.all([
            axiosClient.get("/admin/users"),
            axiosClient.get("/admin/reviews"),
            ]);

            const rawReviews: Review[] = reviewsRes.data;

            const ids = [...new Set(rawReviews.map(r => r.albumId).filter(Boolean))];
            const albumCache: Record<string, { title: string; coverUrl: string }> = {};

            for (const id of ids) {
            try {
                const album = await discogsApi.getAlbumById(id!);
                albumCache[id!] = {
                title: album.title || "Unknown Album",
                coverUrl: album.cover_image || "",
                };
            } catch {
                albumCache[id!] = {
                title: "Unknown Album",
                coverUrl: "",
                };
            }
            }

            const enriched = rawReviews.map(r => ({
            ...r,
            title: albumCache[r.albumId ?? ""]?.title ?? r.title,
            coverUrl: albumCache[r.albumId ?? ""]?.coverUrl ?? r.coverUrl,
            }));

            setUsers(usersRes.data);
            setReviews(enriched);
        } catch (err) {
            console.error(err);
            showToast("⚠️ Failed to load admin data");
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [user, navigate]);

    const filteredUsers = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleRoleChange = async (id: string, role: "user" | "admin") => {
        if (!window.confirm("Change user's role?")) return;
        try {
        await axiosClient.put(`/admin/users/${id}/role`, { role });
        setUsers(prev => prev.map(u => (u._id === id ? { ...u, role } : u)));
        showToast("✅ Role updated");
        } catch {
        showToast("❌ Failed to update role");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm("Delete user and ALL their data?")) return;
        try {
        await axiosClient.delete(`/admin/users/${id}`);
        setUsers(prev => prev.filter(u => u._id !== id));
        showToast("🗑️ User removed");
        } catch {
        showToast("❌ Failed to delete user");
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!window.confirm("Delete review?")) return;
        try {
        await axiosClient.delete(`/reviews/${id}`);
        setReviews(prev => prev.filter(r => r._id !== id));
        showToast("🗑️ Review deleted");
        } catch {
        showToast("❌ Failed to delete review");
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading…</div>;

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: 20, display: "flex", flexWrap: "wrap", gap: 40 }}>
        
        {toast && (
            <div style={{
            position: "fixed",
            top: 80,
            right: 20,
            background: "#333",
            color: "#fff",
            padding: "10px 15px",
            borderRadius: 8
            }}>
            {toast}
            </div>
        )}

        {/* SIDEBAR / ADMIN CARD */}
        <aside style={{ flex: "0 0 250px", borderRight: "1px solid #ddd", paddingRight: 20, minWidth: 230 }}>
            <div style={{ textAlign: "center" }}>
            <div style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "#eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                margin: "0 auto 10px",
                fontWeight: "bold"
            }}>
                {user?.username?.[0].toUpperCase()}
            </div>
            <h2>{user?.username}</h2>
            <p style={{ color: "#666" }}>{user?.email}</p>
            <p style={{ fontWeight: 600 }}>Admin</p>
            </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, minWidth: 300 }}>

            {/* USERS */}
            <section style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Manage Users</h2>
                <button onClick={() => setUsersVisible(v => !v)} style={{ background: "none", border: "none", cursor: "pointer" }}>⌄</button>
            </div>

            {usersVisible && (
                <>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search users..."
                    style={{ width: "100%", maxWidth: 300, marginBottom: 12, padding: 8 }}
                />

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                    <tr style={{ background: "#eee" }}>
                        <th style={{ padding: 8 }}>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map(u => (
                        <tr key={u._id} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: 8 }}>{u.username}</td>
                        <td>{u.email}</td>
                        <td>
                            <select value={u.role} 
                            onChange={e => handleRoleChange(u._id, e.target.value as "user" | "admin")}
                            >
                            <option value="user">user</option>
                            <option value="admin">admin</option>
                            </select>
                        </td>
                        <td>
                            <button onClick={() => handleDeleteUser(u._id)} style={{ background: "red", color: "#fff", border: "none", borderRadius: 6, padding: "5px 8px" }}>
                            ✕
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </>
            )}
            </section>

            {/* REVIEWS */}
            <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h2 style={{ fontSize: 22 }}>All Reviews</h2>
                <button
                onClick={() => setReviewsVisible(!reviewsVisible)}
                style={{
                    background: "none",
                    border: "none",
                    fontSize: 18,
                    cursor: "pointer",
                    transform: reviewsVisible ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 0.2s ease"
                }}
                >
                ⌄
                </button>
            </div>

            <div
                style={{
                maxHeight: reviewsVisible ? "3000px" : "0",
                opacity: reviewsVisible ? 1 : 0,
                overflow: "hidden",
                transition: "all 0.4s ease"
                }}
            >
                {reviews.length === 0 ? (
                <p style={{ color: "#666" }}>No reviews yet.</p>
                ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {reviews.map(r => {
                    const albumId = r.albumId ?? "";
                    const u = typeof r.userId === "string" ? null : r.userId;

                    return (
                        <div
                        key={r._id}
                        onClick={() => {
                            if (!albumId) return;
                            navigate(`/album/${albumId}`);
                        }}
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "flex-start",
                            gap: 15,
                            border: "1px solid #ddd",
                            borderRadius: 10,
                            padding: 15,
                            cursor: "pointer",
                            position: "relative"
                        }}
                        >
                        {/* DELETE */}
                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteReview(r._id);
                            }}
                            style={{
                            position: "absolute",
                            right: 15,
                            top: 15,
                            background: "#ddd",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                            fontSize: 14,
                            padding: "4px 6px"
                            }}
                        >
                            🗑️
                        </button>

                        {/* ALBUM COVER */}
                        <img
                            src={r.coverUrl || "https://via.placeholder.com/100"}
                            alt={r.title || "Album Cover"}
                            style={{
                            width: 100,
                            height: 100,
                            borderRadius: 8,
                            objectFit: "cover"
                            }}
                        />

                        {/* TEXT */}
                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: "bold", fontSize: 14 }}>
                            {u?.username ?? "Unknown User"}{" "}
                            <span style={{ color: "#777", fontSize: 12 }}>
                                ({u?.email ?? "N/A"})
                            </span>
                            </p>

                            <h3 style={{ margin: "5px 0 5px", fontSize: 18, fontWeight: "bold" }}>
                            {r.title || "Unknown Album"}
                            </h3>

                            <p style={{ color: "#ffb400", fontWeight: 600, marginBottom: 5 }}>
                            ⭐ {r.rating}/5
                            </p>

                            <p style={{ color: "#333", fontSize: 14, lineHeight: 1.5 }}>
                            {r.comment || "No comment provided."}
                            </p>
                        </div>
                        </div>
                    );
                    })}
                </div>
                )}
            </div>
            </section>

        </main>
        </div>
    );
}
