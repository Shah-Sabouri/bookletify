import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AlbumCard from "../components/AlbumCard";

interface Album {
    master_id: number
    title: string;
    artist: string;
    cover_image: string;
}

export default function SearchResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get("q");
    const [results, setResults] = useState<Album[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) return;
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://bookletify-api.onrender.com/api/albums/search?q=${query}`);
                const data = await res.json();
                setResults(data);
            } catch (err) {
                console.error("Search failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    if (loading) return <p className="text-center mt-10">Searching for "{query}"...</p>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">Search results for: "{query}"</h2>

            {results.length === 0 ? (
                <p className="text-gray-500">No results found.</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {results.map((album) => (
                        <div
                        key={album.master_id}
                        onClick={() => navigate(`/album/${album.master_id}`, { state: { fromSearch: true } })}
                        className="cursor-pointer"
                        >
                            <AlbumCard album={album} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}