import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import { addToFavorites, removeFromFavorites, getUserFavorites } from "../services/favoritesApi";
import ReviewsList from "../components/ReviewsList";
import ReviewForm from "../components/ReviewForm";
import type { Album, Track } from "../types/album";
import { reviewsApi } from "../services/reviewsApi";
import GoBackButton from "../components/GoBackButton";

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
    const [toast, setToast] = useState<string | null>(null); // ✅ Toast text

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!id) return;
            setLoading(true);
            setError("");
            
            try {
                const result = await discogsApi.getAlbumById(id);
                setAlbum(result);

                // Check if already in favorites
                const favorites = await getUserFavorites();
                const isFav = favorites.some((f: Favorite) => f.albumId === id);
                setIsFavorited(isFav);
            } catch (err) {
                console.error(err);
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
        showToast("🗑️ Review deleted")
    }

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
    
    } catch (err) {
        console.error(err);
        showToast("⚠️ Failed to update favorites");
        }
    };

    if (loading) return <p>Loading album...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!album) return <p>No album found.</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto", position: "relative" }}>
        {/* 🔔 Toast Notification */}
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

      {/* Go Back button */}
        <GoBackButton />

        <h2>{album.title}</h2>

        {album.cover_image && (
            <img
                src={album.cover_image}
                alt={album.title}
                width={250}
                style={{ borderRadius: "10px", marginBottom: "15px" }}
            />
        )}

        <p><strong>Year:</strong> {album.year || "Unknown"}</p>
        <p><strong>Country:</strong> {album.country || "Unknown"}</p>
        <p><strong>Format:</strong> {album.format?.join(", ") || "N/A"}</p>
        <p><strong>Genre:</strong> {album.genre?.join(", ") || "N/A"}</p>

        {/* Tracklist */}
        {album.tracklist && album.tracklist.length > 0 && (
            <div style={{ marginTop: "25px" }}>
                <h3>Track List</h3>
                <ul style={{ listStyle: "disc", paddingLeft: "20px" }}>
                    {album.tracklist.map((track: Track, index: number) => (
                        <li key={index}>
                            <strong>{track.position}</strong> {track.title}{" "}
                            <span style={{ color: "gray" }}>({track.duration || "?"})</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* ❤️ Toggle Favorite button */}
        <button
        onClick={handleFavoriteToggle}
        style={{
            marginTop: "20px",
            backgroundColor: isFavorited ? "#aaa" : "#ff6b81",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
        }}
        >
            {isFavorited ? "💔 Remove from Favorites" : "❤️ Add to Favorites"}
            </button>

            <h3 style={{ marginTop: "30px" }}>Reviews</h3>
            <ReviewsList albumId={id!} onDelete={handleDeleteReview} />
            <ReviewForm albumId={id!} />
        </div>
    );
};

export default AlbumDetailPage;
