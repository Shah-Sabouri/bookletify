import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import { addToFavorites } from "../services/favoritesApi";
import ReviewsList from "../components/ReviewsList";
import ReviewForm from "../components/ReviewForm";
import type { Album, Track } from "../types/album";

const AlbumDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!id) return;
            setLoading(true);
            setError("");

            try {
                const result = await discogsApi.getAlbumById(id);
                setAlbum(result);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch album details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [id]);

    const handleAddFavorite = async () => {
        if (!album) return;
        try {
            await addToFavorites(album);
            alert("Added to favorites!");
        } catch (err) {
            console.error(err);
            setError("Failed to add to favorites.");
        }
    };

    const handleGoBack = () => {
        navigate("/");
    };

    if (loading) return <p>Loading album...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!album) return <p>No album found.</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "700px", margin: "0 auto" }}>
            {/* Go Back button */}
            <button
                onClick={handleGoBack}
                style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    cursor: "pointer",
                    fontSize: "16px",
                    marginBottom: "20px",
                }}
            >
                ← Go Back
            </button>

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
                                <span style={{ color: "gray" }}>
                                    ({track.duration || "?"})
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button
                onClick={handleAddFavorite}
                style={{
                    marginTop: "20px",
                    backgroundColor: "#ff6b81",
                    color: "#fff",
                    border: "none",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                ❤️ Add to Favorites
            </button>

            <h3 style={{ marginTop: "30px" }}>Reviews</h3>
            <ReviewsList albumId={id!} />
            <ReviewForm albumId={id!} />
        </div>
    );
};

export default AlbumDetailPage;
