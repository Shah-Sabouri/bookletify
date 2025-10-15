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
        setResults([]);

        try {
            const albums: Album[] = await discogsApi.searchAlbums(query);
            setResults(albums);
        } catch (err: unknown) {
            console.error(err);
            setError("Failed to fetch albums. Try again.");
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

            {!loading && results.length === 0 && query && (
                <p>No results found for "{query}".</p>
            )}

            <div style={{ display: "flex", flexWrap: "wrap" }}>
                {results.map((album, index) => (
                <AlbumCard key={index} {...album} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;
