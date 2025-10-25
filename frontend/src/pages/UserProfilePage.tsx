import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import AlbumCard from "../components/AlbumCard";
import { useNavigate } from "react-router-dom";

interface Favorite {
    _id: string;
    albumId: string;
    title?: string;
    artist?: string;
    coverUrl?: string;
}

interface Review {
    _id: string;
    albumId?: string;
    album_id?: string;
    rating: number;
    comment?: string;
    text?: string;
}

export default function UserProfilePage() {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }

        const fetchUserData = async () => {
            try {
                const [favRes, revRes] = await Promise.all([
                    fetch(`https://bookletify-api.onrender.com/api/favorites`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`https://bookletify-api.onrender.com/api/reviews/user`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                
                if (!favRes.ok || !revRes.ok) {
                    throw new Error("Failed to fetch user data");
                }

                const favData = await favRes.json();
                const revData = await revRes.json();

                setFavorites(favData);
                setReviews(revData);
            } catch {
                setError("Could not load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, token, navigate]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;
    if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
        {/* USER INFO */}
        <div className="flex flex-col items-center md:items-start mb-8 border-b border-gray-300 pb-6">
            <h1 className="text-3xl font-bold mb-2">{user?.username}</h1>
            <p className="text-gray-600">{user?.email}</p>
        </div>

        {/* FAVORITES */}
        <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
            {favorites.length === 0 ? (
                <p className="text-gray-500">No favorites yet.</p>
            ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {favorites.map((fav) => (
                <div
                    key={fav._id}
                    onClick={() => navigate(`/album/${fav.albumId}`)}
                    className="cursor-pointer"
                >
                    <AlbumCard
                    album={{
                        master_id: Number(fav.albumId),
                        title: fav.title || "View album",
                        artist: fav.artist || "Unknown Artist",
                        cover_image: fav.coverUrl || "",
                    }}
                    />
                </div>
                ))}
            </div>
            )}
        </section>

        {/* REVIEWS */}
        <section>
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews written yet.</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => {
                const albumId = review.albumId || review.album_id;
                return (
                    <div
                    key={review._id}
                    onClick={() => navigate(`/album/${albumId}`)}
                    className="cursor-pointer border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                    >
                    <AlbumCard
                        album={{
                        master_id: Number(albumId),
                        title: "Album Review",
                        artist: "Unknown Artist",
                        cover_image: "",
                        }}
                    />
                    <div className="mt-3">
                        <p className="text-yellow-500 font-medium">
                        ⭐ {review.rating}/5
                        </p>
                        <p className="text-gray-700 mt-1 text-sm">
                        {review.comment || review.text || "No comment provided"}
                        </p>
                    </div>
                    </div>
                );
                })}
            </div>
            )}
        </section>
        </div>
    );
}
