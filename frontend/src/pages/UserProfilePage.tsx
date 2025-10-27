import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import AlbumCard from "../components/AlbumCard";
import { useNavigate } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import { removeFromFavorites } from "../services/favoritesApi";

interface Favorite {
    _id: string;
    albumId: string;
    title?: string;
    artist?: string;
    coverUrl?: string;
}

interface Review {
    _id: string;
    albumId?: string;
    album_id?: string;
    rating: number;
    comment?: string;
    text?: string;
    title?: string;
    artist?: string;
    coverUrl?: string;
}

export default function UserProfilePage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [favoritesVisible, setFavoritesVisible] = useState(true);
    const [reviewsVisible, setReviewsVisible] = useState(true);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [toast, setToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }

        const fetchUserData = async () => {
            try {
                const [favRes, revRes] = await Promise.all([
                    fetch(`https://bookletify-api.onrender.com/api/favorites`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`https://bookletify-api.onrender.com/api/reviews/user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                if (!favRes.ok || !revRes.ok) throw new Error("Failed to fetch user data");

                const favData = await favRes.json();
                const revData = await revRes.json();

                // --- Build list of IDs we need details for (only missing/unknown ones) ---
                const idsToFetch = [
                    ...favData
                        .filter((f: Favorite) => !f.title || !f.artist || f.artist === "Unknown Artist")
                        .map((f: Favorite) => f.albumId),
                    ...revData.map((r: Review) => r.albumId || r.album_id),
                ].filter(Boolean);

                const uniqueIds = [...new Set(idsToFetch)];
                const albumDetails: Record<string, { title: string; artist: string; coverUrl: string }> = {};

                // fetch details only for unique ids
                for (const id of uniqueIds) {
                    try {
                        const album = await discogsApi.getAlbumById(id);
                        albumDetails[id] = {
                            title: album.title || "Unknown Album",
                            artist: album.artist || "Unknown Artist",
                            coverUrl: album.cover_image || "",
                        };
                    } catch {
                        albumDetails[id] = {
                            title: "Unknown Album",
                            artist: "Unknown Artist",
                            coverUrl: "",
                        };
                    }
                }

                // enrich favorites & reviews with fetched details (if missing)
                const enrichedFavs = favData.map((f: Favorite) => ({
                    ...f,
                    title: f.title || albumDetails[f.albumId]?.title || "Unknown Album",
                    artist: f.artist || albumDetails[f.albumId]?.artist || "Unknown Artist",
                    coverUrl: f.coverUrl || albumDetails[f.albumId]?.coverUrl || "",
                }));

                const enrichedRevs = revData.map((r: Review) => {
                    const id = r.albumId || r.album_id;
                    return {
                        ...r,
                        title: r.title || albumDetails[id!]?.title || "Unknown Album",
                        artist: r.artist || albumDetails[id!]?.artist || "Unknown Artist",
                        coverUrl: r.coverUrl || albumDetails[id!]?.coverUrl || "",
                    };
                });

                setFavorites(enrichedFavs);
                setReviews(enrichedRevs);
            } catch {
                setError("Could not load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, token, navigate]);

    const handleRemoveFavorite = async (albumId: string) => {
        try {
            await removeFromFavorites(albumId);
            setFavorites((prev) => prev.filter((f) => f.albumId !== albumId));
            showToast("❌ Removed from favorites");
        } catch (err) {
            console.error(err);
            showToast("⚠️ Failed to remove favorite");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setProfileImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    if (loading) return <div style={{ textAlign: "center", marginTop: "40px" }}>Loading...</div>;
    if (error) return <div style={{ textAlign: "center", color: "red", marginTop: "40px" }}>{error}</div>;

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "20px",
                gap: "40px",
                alignItems: "flex-start",
                position: "relative",
            }}
        >
            {/* 🔔 Toast Notification (fixed under navbar) */}
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
                        zIndex: 1000,
                        transition: "opacity 0.3s ease",
                    }}
                >
                    {toast}
                </div>
            )}

            {/* LEFT COLUMN — USER INFO */}
            <aside
                style={{
                    flex: "0 0 250px",
                    borderRight: "1px solid #ddd",
                    paddingRight: "20px",
                    minWidth: "230px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }}
                >
                    <label htmlFor="profile-upload" style={{ cursor: "pointer" }} title="Upload profile picture">
                        <div
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                backgroundColor: "#eee",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "36px",
                                fontWeight: "bold",
                                color: "#888",
                                marginBottom: "15px",
                            }}
                        >
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            ) : (
                                user?.username?.[0]?.toUpperCase() || "U"
                            )}
                        </div>
                    </label>
                    <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                    />
                    <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "5px" }}>{user?.username}</h1>
                    <p style={{ color: "#666", fontSize: "14px" }}>{user?.email}</p>
                </div>
            </aside>

            {/* RIGHT COLUMN — FAVORITES & REVIEWS */}
            <main style={{ flex: 1, minWidth: "300px" }}>
                {/* FAVORITES */}
                <section style={{ marginBottom: "40px" }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                        }}
                    >
                        <h2 style={{ fontSize: "22px" }}>Favorites</h2>
                        <button
                            onClick={() => setFavoritesVisible(!favoritesVisible)}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "18px",
                                cursor: "pointer",
                                transform: favoritesVisible ? "rotate(0deg)" : "rotate(-90deg)",
                                transition: "transform 0.2s ease",
                            }}
                        >
                            ⌄
                        </button>
                    </div>

                    <div
                        style={{
                            maxHeight: favoritesVisible ? "1000px" : "0",
                            opacity: favoritesVisible ? 1 : 0,
                            overflow: "hidden",
                            transition: "all 0.4s ease",
                        }}
                    >
                        {favorites.length === 0 ? (
                            <p style={{ color: "#666" }}>No favorites yet.</p>
                        ) : (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                                    gap: "20px",
                                }}
                            >
                                {favorites.map((fav) => (
                                    <div
                                        key={fav._id}
                                        style={{
                                            position: "relative",
                                            cursor: "pointer",
                                            borderRadius: "10px",
                                        }}
                                    >
                                        {/* ❌ REMOVE FAVORITE (stop propagation so click doesn't open album) */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFavorite(fav.albumId);
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: "20px",
                                                left: "20px",
                                                background: "#ff4d4f",
                                                border: "none",
                                                borderRadius: "6px",
                                                color: "#fff",
                                                fontSize: "12px",
                                                padding: "4px 6px",
                                                cursor: "pointer",
                                                zIndex: 3,
                                            }}
                                            title="Remove favorite"
                                        >
                                            ✕
                                        </button>

                                        <div onClick={() => navigate(`/album/${fav.albumId}`)}>
                                            <AlbumCard
                                                album={{
                                                    master_id: Number(fav.albumId),
                                                    title: fav.title || "Unknown Album",
                                                    cover_image: fav.coverUrl || "",
                                                } as any}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* REVIEWS */}
                <section>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "10px",
                        }}
                    >
                        <h2 style={{ fontSize: "22px" }}>Reviews</h2>
                        <button
                            onClick={() => setReviewsVisible(!reviewsVisible)}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: "18px",
                                cursor: "pointer",
                                transform: reviewsVisible ? "rotate(0deg)" : "rotate(-90deg)",
                                transition: "transform 0.2s ease",
                            }}
                        >
                            ⌄
                        </button>
                    </div>

                    <div
                        style={{
                            maxHeight: reviewsVisible ? "2000px" : "0",
                            opacity: reviewsVisible ? 1 : 0,
                            overflow: "hidden",
                            transition: "all 0.4s ease",
                        }}
                    >
                        {reviews.length === 0 ? (
                            <p style={{ color: "#666" }}>No reviews written yet.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                                {reviews.map((review) => {
                                    const albumId = review.albumId || review.album_id;
                                    return (
                                        <div
                                            key={review._id}
                                            onClick={() => navigate(`/album/${albumId}`)}
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                alignItems: "flex-start",
                                                gap: "15px",
                                                border: "1px solid #ddd",
                                                borderRadius: "10px",
                                                padding: "15px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <img
                                                src={review.coverUrl || "https://via.placeholder.com/100"}
                                                alt={review.title || "Album Cover"}
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    borderRadius: "8px",
                                                    objectFit: "cover",
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ margin: "0 0 5px", fontSize: "18px", fontWeight: "bold" }}>
                                                    {review.title || "Unknown Album"}
                                                </h3>
                                                <p style={{ margin: "0 0 8px", color: "#777" }}>
                                                    {review.artist || "Unknown Artist"}
                                                </p>
                                                <p style={{ color: "#ffb400", fontWeight: 600, marginBottom: "5px" }}>
                                                    ⭐ {review.rating}/5
                                                </p>
                                                <p style={{ color: "#333", fontSize: "14px", lineHeight: "1.5" }}>
                                                    {review.comment || review.text || "No comment provided."}
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
