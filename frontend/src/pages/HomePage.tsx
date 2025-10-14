import React, { useState } from "react";
import { discogsApi } from "../services/discogsApi";
import AlbumCard from "../components/AlbumCard";
import type { Album } from "../types/album";

const HomePage: React.FC = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Album[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        setError("");
        try {
            const albums = await discogsApi.searchAlbums(query);
            setResults(albums);
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
                setError("Failed to fetch albums. Try again.");
            } else {
                console.error(err);
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Bookletify 🎵</h1>
            <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
            <input
                type="text"
                placeholder="Search artist..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ padding: "8px", width: "250px" }}
            />
            <button type="submit" style={{ padding: "8px", marginLeft: "5px" }}>
                Search
            </button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {results.length === 0 && !loading && <p>No results found.</p>}

        <div style={{ display: "flex", flexWrap: "wrap" }}>
            {results.map((album, index) => (
                <AlbumCard key={index} {...album} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
