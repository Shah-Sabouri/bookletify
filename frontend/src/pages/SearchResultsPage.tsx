import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import AlbumCard from "../components/AlbumCard";
import type { Album } from "../types/album";

export default function SearchResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get("q") || "";

    const [results, setResults] = useState<Album[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            setLoading(true);
            setError("");
            try {
                const albums = await discogsApi.searchAlbums(query);
                setResults(albums);
            } catch (err) {
                console.error("Search failed:", err);
                setError("Failed to fetch albums. Try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);
    
    if (loading) return <p style={{ textAlign: "center", marginTop: "20px" }}>Searching for “{query}”...</p>;
    
    return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>
            Search results for: “{query}”
        </h2>
        
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {results.length === 0 && !loading && !error ? (
            <p style={{ color: "#555" }}>No results found.</p>
        ) : (
            <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
            }}
            >
                {results.map((album) => (
                    <div
                    key={album.master_id}
                    onClick={() =>
                        navigate(`/album/${album.master_id}`, { state: { fromSearch: true } })
                    }
                    style={{ cursor: "pointer" }}
                    >
                        <AlbumCard album={album} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
