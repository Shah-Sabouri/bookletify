import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import AlbumCard from "../components/AlbumCard";
import { useNavigate } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import { removeFromFavorites } from "../services/favoritesApi";
import { reviewsApi } from "../services/reviewsApi";
import styles from "./UserProfilePage.module.css";
import GoBackButton from "../components/GoBackButton";

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

            const idsToFetch = [
                ...favData
                .filter((f: Favorite) => !f.title || !f.artist)
                .map((f: Favorite) => f.albumId),
                ...revData.map((r: Review) => r.albumId || r.album_id),
                ].filter(Boolean);

                const uniqueIds = [...new Set(idsToFetch)];
                const albumDetails: Record<string, { title: string; artist: string; coverUrl: string }> = {};

                for (const id of uniqueIds) {
                    try {
                        const album = await discogsApi.getAlbumById(id);
                        albumDetails[id] = {
                            title: album.title || "Unknown Album",
                            artist: album.artist || "",
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

                const enrichedFavs = favData.map((f: Favorite) => ({
                    ...f,
                    title: f.title || albumDetails[f.albumId]?.title || "Unknown Album",
                    artist: f.artist || albumDetails[f.albumId]?.artist,
                    coverUrl: f.coverUrl || albumDetails[f.albumId]?.coverUrl || "",
                }));

                const enrichedRevs = revData.map((r: Review) => {
                    const id = r.albumId || r.album_id;
                    return {
                            ...r,
                            title: r.title || albumDetails[id!]?.title || "Unknown Album",
                            artist: r.artist || albumDetails[id!]?.artist,
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
        
        const refresh = () => fetchUserData();
        window.addEventListener("refreshReviews", refresh);
        return () => window.removeEventListener("refreshReviews", refresh);
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
    <div className={styles.container}>
        {toast && <div className={styles.toast}>{toast}</div>}

        <div className={styles.topBar}>
            <GoBackButton />
        </div>
        
        <aside className={styles.sidebar}>
            <div className={styles.profileBox}>
                <label htmlFor="profile-upload" title="Upload profile picture">
                    <div className={styles.profileImgWrapper}>
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
                <input id="profile-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
                <h1 className={styles.username}>{user?.username}</h1>
                <p className={styles.email}>{user?.email}</p>
            </div>
        </aside>

        <main className={styles.main}>
            <section>
                <div className={styles.sectionHeader}>
                    <h2>Favorites</h2>
                    <button
                    onClick={() => setFavoritesVisible(!favoritesVisible)}
                    className={styles.sectionToggle}
                    style={{ transform: favoritesVisible ? "rotate(0)" : "rotate(-90deg)" }}
                >
                    ⌄
                    </button>
                </div>
                
                <div
                className={styles.collapse}
                style={{
                    maxHeight: favoritesVisible ? "1000px" : "0",
                    opacity: favoritesVisible ? 1 : 0,
                }}
                >
                    {favorites.length === 0 ? (
                        <p className={styles.grayText}>No favorites yet.</p>
                    ) : (
                    <div className={styles.favoritesGrid}>
                        {favorites.map((fav) => (
                            <div key={fav._id} className={styles.favoriteCard}>
                                <button
                                className={styles.removeFavBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFavorite(fav.albumId);
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
                                    } as unknown as {
                                        master_id: number;
                                        title: string;
                                        cover_image: string;
                                    }}
                                />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>

        <section>
            <div className={styles.sectionHeader}>
                <h2>Reviews</h2>
                <button
                onClick={() => setReviewsVisible(!reviewsVisible)}
                className={styles.sectionToggle}
                style={{ transform: reviewsVisible ? "rotate(0)" : "rotate(-90deg)" }}
                >
                    ⌄
                </button>
            </div>

            <div
            className={styles.collapse}
            style={{
                maxHeight: reviewsVisible ? "2000px" : "0",
                opacity: reviewsVisible ? 1 : 0,
            }}
            >
                {reviews.length === 0 ? (
                    <p className={styles.grayText}>No reviews written yet.</p>
                    ) : (
                    <div className={styles.reviewsList}>
                        {reviews.map((review) => {
                            const albumId = review.albumId || review.album_id;
                        
                            return (
                                <div
                                key={review._id}
                                className={styles.reviewCard}
                                onClick={() => navigate(`/album/${albumId}`)}
                                >
                                    <button
                                    className={styles.deleteReviewBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        reviewsApi.deleteReview(review._id);
                                        setReviews((prev) => prev.filter((r) => r._id !== review._id));
                                    }}
                                    >
                                        🗑️
                                    </button>

                                    <img
                                        src={review.coverUrl || "https://via.placeholder.com/100"}
                                        alt={review.title || "Album Cover"}
                                        className={styles.reviewCover}
                                    />
                            
                                    <div style={{ flex: 1 }}>
                                        <h3>{review.title || "Unknown Album"}</h3>
                                        <p className={styles.grayText}>{review.artist}</p>
                                        <p className={styles.starRating}>⭐ {review.rating}/5</p>
                                        <p>{review.comment || review.text || "No comment provided."}</p>
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
