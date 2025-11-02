import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import { addToFavorites, removeFromFavorites, getUserFavorites } from "../services/favoritesApi";
import ReviewsList from "../components/ReviewsList";
import ReviewForm from "../components/ReviewForm";
import type { Album, Track } from "../types/album";
import { reviewsApi } from "../services/reviewsApi";
import GoBackButton from "../components/GoBackButton";
import styles from "./AlbumDetailPage.module.css";

interface Favorite {
    _id: string;
    albumId: string;
    title?: string;
    artist?: string;
    coverUrl?: string;
}

const AlbumDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isFavorited, setIsFavorited] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!id) return;
            setLoading(true);
            setError("");
            
            try {
                const result = await discogsApi.getAlbumById(id);
                setAlbum(result);

                const favorites = await getUserFavorites();
                const isFav = favorites.some((f: Favorite) => f.albumId === id);
                setIsFavorited(isFav);
            } catch {
                setError("Failed to fetch album details.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchAlbum();
    }, [id]);

    const showToast = (message: string) => {
        setToast(message);
        setTimeout(() => setToast(null), 2500);
    };

    const handleDeleteReview = async (reviewId: string) => {
        await reviewsApi.deleteReview(reviewId);
        window.dispatchEvent(new Event("refreshReviews"));
        showToast("🗑️ Review deleted");
    };

    const handleFavoriteToggle = async () => {
        if (!album) return;

        try {
            if (isFavorited) {
                await removeFromFavorites(album.master_id.toString());
                setIsFavorited(false);
                showToast("❌ Removed from favorites");
            } else {
                await addToFavorites({
                    albumId: album.master_id.toString(),
                    title: album.title,
                    artist: album.artist || "Unknown Artist",
                    coverUrl: album.cover_image || "",
                });
                setIsFavorited(true);
                showToast("✅ Added to favorites");
            }
        } catch {
            showToast("⚠️ Failed to update favorites");
        }
    };

    if (loading) return <p className={styles.center}>Loading album...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (!album) return <p className={styles.center}>No album found.</p>;

    return (
    <div className={styles.page}>
        <GoBackButton />
        
        {toast && <div className={styles.toast}>{toast}</div>}
        
        <div className={styles.layout}>
            {/* LEFT SIDE */}
            <div className={styles.albumInfo}>
                <h2>{album.title}</h2>
                
                {album.cover_image && (
                    <img className={styles.cover} src={album.cover_image} alt={album.title} />
                    )}

                <p><strong>Year:</strong> {album.year || "Unknown"}</p>
                <p><strong>Country:</strong> {album.country || "Unknown"}</p>
                <p><strong>Format:</strong> {album.format?.join(", ") || "N/A"}</p>
                <p><strong>Genre:</strong> {album.genre?.join(", ") || "N/A"}</p>
                
                {album.tracklist && album.tracklist.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                        <h3>Track List</h3>
                        <ul className={styles.tracklist}>
                            {album.tracklist.map((track: Track, index: number) => (
                                <li key={index}>
                                    <strong>{track.position}</strong> {track.title}{" "}
                                    <span className={styles.duration}>({track.duration || "?"})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    className={`${styles.favBtn} ${isFavorited ? styles.remove : styles.add}`}
                    onClick={handleFavoriteToggle}
                >
                    {isFavorited ? "💔 Remove from Favorites" : "❤️ Add to Favorites"}
                </button>
            </div>
            
            {/* RIGHT SIDE */}
            <div className={styles.sidePanel}>
                <h3>Reviews</h3>
                <ReviewsList albumId={id!} onDelete={handleDeleteReview} />
                <ReviewForm albumId={id!} />
            </div>
        </div>
    </div>
    );
};

export default AlbumDetailPage;
