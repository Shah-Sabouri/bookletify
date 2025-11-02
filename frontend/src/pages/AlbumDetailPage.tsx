import { useEffect, useState } from "react";
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
}

export default function AlbumDetailPage() {
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
                setIsFavorited(favorites.some((f: Favorite) => f.albumId === id));
            } catch {
                setError("Failed to fetch album details.");
            } finally {
            setLoading(false);
        }
    };

    fetchAlbum();
    }, [id]);

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2400);
    };

    const handleFavoriteToggle = async () => {
        if (!album) return;

        try {
            if (isFavorited) {
                await removeFromFavorites(album.master_id.toString());
                setIsFavorited(false);
                showToast("Removed from favorites ❌");
            } else {
                await addToFavorites({
                    albumId: album.master_id.toString(),
                    title: album.title,
                    artist: album.artist ?? "Unknown Artist",
                    coverUrl: album.cover_image ?? "",
                });
                
                setIsFavorited(true);
                showToast("Added to favorites ❤️");
            }
        } catch {
            showToast("Could not update favorites ⚠️");
        }
    };

    const handleDeleteReview = async (reviewId: string) => {
        await reviewsApi.deleteReview(reviewId);
        window.dispatchEvent(new Event("refreshReviews"));
        showToast("Review deleted 🗑️");
    };

    if (loading) return <p className={styles.center}>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;
    if (!album) return <p className={styles.center}>Album not found.</p>;
    
    return (
        <div className={styles.page}>
            <GoBackButton />
            
            {toast && <div className={styles.toast}>{toast}</div>}
            <div className={styles.layout}>
                
                {/* LEFT */}
                <div className={styles.left}>
                    <img className={styles.cover} src={album.cover_image} alt={album.title} />
                    
                    <h2 className={styles.title}>{album.title}</h2>
                    <p><strong>Year:</strong> {album.year ?? "Unknown"}</p>
                    <p><strong>Country:</strong> {album.country ?? "Unknown"}</p>
                    <p><strong>Format:</strong> {album.format?.join(", ") ?? "N/A"}</p>
                    <p><strong>Genre:</strong> {album.genre?.join(", ") ?? "N/A"}</p>
                    
                    {Array.isArray(album.tracklist) && album.tracklist.length > 0 && (
                        <div className={styles.trackBox}>
                            <h3>Tracks</h3>
                            <ul className={styles.tracklist}>
                                {album.tracklist?.map((track: Track, i) => (
                                    <li key={i}>
                                        <strong>{track.position}</strong> {track.title}
                                        <span className={styles.duration}> ({track.duration || "?"})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* RIGHT */}
                <aside className={styles.right}>
                    <button 
                    onClick={handleFavoriteToggle}
                    className={`${styles.favBtn} ${isFavorited ? styles.remove : styles.add}`}
                    >
                        {isFavorited ? "💔 Remove Favorite" : "❤️ Add Favorite"}
                    </button>

                    <h3 className={styles.revTitle}>Reviews</h3>
                    <ReviewsList albumId={id!} onDelete={handleDeleteReview} />
                    <ReviewForm albumId={id!} />
                </aside>
            </div>
        </div>
    );
}
