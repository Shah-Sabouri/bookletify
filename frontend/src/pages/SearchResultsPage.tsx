import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { discogsApi } from "../services/discogsApi";
import AlbumCard from "../components/AlbumCard";
import type { Album } from "../types/album";
import styles from "./SearchResultsPage.module.css";
import GoBackButton from "../components/GoBackButton";

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

    if (loading) {
        return (
            <div className={styles.loading}>
                Searching for “{query}”...
            </div>
        );
    }
    
    return (
    <div className={styles.container}>
        <GoBackButton />
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
