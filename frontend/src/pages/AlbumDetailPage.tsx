import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import { addToFavorites } from "../services/favoritesApi";
import ReviewsList from "../components/ReviewsList";
import ReviewForm from "../components/ReviewForm";
import type { Album } from "../types/album";

const AlbumDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const masterId = Number(id);
    const [album, setAlbum] = useState<Album | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!masterId) return;
            setLoading(true);
            try {
                console.log("Fetching album with master_id:", masterId);
                const result = await discogsApi.getAlbumById(masterId);
                setAlbum(result);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch album details.")
            } finally {
                setLoading(false);
            }
        };
        fetchAlbum();
    }, [masterId]);

    const handleAddFavorite = async () => {
        if (!album) return;
        try {
            await addToFavorites(album);
            alert("Added to favorites!");
        } catch (err) {
            console.error(err)
            setError("Failed to add to favorites.");
        }
    };

    if (loading) return <p>Loading album...</p>
    if (error) return <p style={{ color: "red"}}>{error}</p>
    if (!album) return <p>No album found.</p>

    return (
        <div style={{ padding: "20px" }}>
        <h2>{album.title}</h2>
        <img src={album.cover_image} alt={album.title} width={250} />
        <p><strong>Year:</strong> {album.year || "Unknown"}</p>
        <p><strong>Country:</strong> {album.country || "Unknown"}</p>
        <p><strong>Format:</strong> {album.format?.join(", ") || "N/A"}</p>
        <p><strong>Genre:</strong> {album.genre?.join(", ") || "N/A"}</p>

        <button onClick={handleAddFavorite} style={{ marginTop: "10px" }}>
            ❤️ Add to Favorites
        </button>

        <h3 style={{ marginTop: "30px" }}>Reviews</h3>
        <ReviewsList albumId={id!} />
        <ReviewForm albumId={id!} />
        </div>
    );
};

export default AlbumDetailPage;