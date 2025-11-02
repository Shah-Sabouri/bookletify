import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import AlbumCard from "../components/AlbumCard";
import type { Album } from "../types/album";
import styles from "./SearchResultsPage.module.css";

export default function SearchResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get("q") || "";

    const [results, setResults] = useState<Album[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoBack = () => {
        if (window.history.state && window.history.state.idx > 0) navigate(-1);
        else navigate("/");
    };

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

    if (loading) {
        return (
            <div className={styles.loading}>
                Searching for “{query}”...
            </div>
        );
    }
    
    return (
    <div className={styles.container}>
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

        <h2 className={styles.heading}>
            Search results for: “{query}”
        </h2>

        {error && <p className={styles.error}>{error}</p>}

        {results.length === 0 && !loading && !error ? (
            <p className={styles.noResults}>No results found.</p>
        ) : (
        <div className={styles.grid}>
            {results.map((album) => (
                <div
                key={album.master_id}
                onClick={() => navigate(`/album/${album.master_id}`, { state: { fromSearch: true } })}
                className={styles.cardWrapper}
                >
                    <AlbumCard album={album} />
                </div>
            ))}
        </div>
        )}
    </div>
    );
}
