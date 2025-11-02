import { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import styles from "./AdminDashboard.module.css";

interface User {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
}

interface Review {
    _id: string;
    userId: { _id: string; username: string; email: string } | string;
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
            const ids = [...new Set(rawReviews.map((r) => r.albumId).filter(Boolean))];

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

            const enriched = rawReviews.map((r) => ({
                ...r,
                title: albumCache[r.albumId ?? ""]?.title ?? r.title,
                coverUrl: albumCache[r.albumId ?? ""]?.coverUrl ?? r.coverUrl,
                }));

                setUsers(usersRes.data);
                setReviews(enriched);
            } catch {
                showToast("⚠️ Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [user, navigate]);

    const filteredUsers = users.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleRoleChange = async (id: string, role: "user" | "admin") => {
        if (!window.confirm("Change user's role?")) return;
        
        try {
            await axiosClient.put(`/admin/users/${id}/role`, { role });
            setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
            showToast("✅ Role updated");
        } catch {
            showToast("❌ Failed to update role");
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm("Delete user and ALL their data?")) return;

        try {
            await axiosClient.delete(`/admin/users/${id}`);
            setUsers((prev) => prev.filter((u) => u._id !== id));
            showToast("🗑️ User removed");
        } catch {
            showToast("❌ Failed to delete user");
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}>Loading…</div>;

    return (
    <div className={styles.container}>
        {toast && <div className={styles.toast}>{toast}</div>}
        
        {/* Sidebar */}
        <aside className={styles.sidebar}>
            <div>
                <div className={styles.profileCircle}>
                    {user?.username?.[0].toUpperCase()}
                </div>
                <h2>{user?.username}</h2>
                <p className={styles.gray}>{user?.email}</p>
                <p style={{ fontWeight: 600 }}>Admin</p>
            </div>
        </aside>

        {/* Main */}
        <main className={styles.main}>
            {/* USERS */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Manage Users</h2>
                    <button
                    onClick={() => setUsersVisible((v) => !v)}
                    className={styles.toggleBtn}
                    style={{ transform: usersVisible ? "rotate(0deg)" : "rotate(-90deg)" }}
                    >
                        ⌄
                    </button>
                </div>

                {usersVisible && (
                    <>
                    <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className={styles.searchInput}
                    />

                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u._id}>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                        value={u.role}
                                        onChange={(e) =>
                                            handleRoleChange(u._id, e.target.value as "user" | "admin")
                                        }
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button
                                        onClick={() => handleDeleteUser(u._id)}
                                        className={styles.deleteUserBtn}
                                        >
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
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>All Reviews</h2>
                    <button
                    onClick={() => setReviewsVisible(!reviewsVisible)}
                    className={styles.toggleBtn}
                    style={{ transform: reviewsVisible ? "rotate(0deg)" : "rotate(-90deg)" }}
                    >
                        ⌄
                    </button>
                </div>
                
                {reviewsVisible && (
                    <div style={{ transition: "all 0.4s ease" }}>
                        {reviews.length === 0 ? (
                            <p className={styles.gray}>No reviews yet.</p>
                        ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            {reviews.map((r) => {
                                const albumId = r.albumId ?? "";
                                const u = typeof r.userId === "string" ? null : r.userId;
                                
                                return (
                                <div
                                key={r._id}
                                className={styles.reviewCard}
                                onClick={() => {
                                    if (!albumId) return;
                                    navigate(`/album/${albumId}`);
                                }}
                                >
                                    <img
                                    src={r.coverUrl || "https://via.placeholder.com/100"}
                                    alt={r.title || "Album Cover"}
                                    className={styles.reviewImg}
                                    />
                                    
                                    <div style={{ flex: 1 }}>
                                        <p style={{ margin: 0, fontWeight: "bold", fontSize: 14 }}>
                                            {u?.username ?? "Unknown User"}{" "}
                                            <span className={styles.gray} style={{ fontSize: 12 }}>
                                                ({u?.email ?? "N/A"})
                                            </span>
                                        </p>

                                        <h3 style={{ margin: "5px 0", fontSize: 18, fontWeight: "bold" }}>
                                            {r.title || "Unknown Album"}
                                        </h3>

                                        <p className={styles.reviewRating}>⭐ {r.rating}/5</p>

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
                )}
            </section>
        </main>
    </div>
    );
}
