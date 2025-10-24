import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import AlbumCard from "../components/AlbumCard";
import { useNavigate } from "react-router-dom";

interface Album {
    _id: string;
    master_id: number;
    title: string;
    artist: string;
    coverUrl: string;
}

interface Favorite {
    _id: string;
    albumId: string;
    createdAt: string;
}

interface Review {
    _id: string;
    albumTitle: string;
    rating: number;
    text: string;
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
            {/* User Info */}
            <div className="flex flex-col items-center md:items-start mb-8 border-b border-gray-300 pb-6">
                <h1 className="text-3xl font-bold mb-2">{user?.username}</h1>
                <p className="text-gray-600">{user?.email}</p>
            </div>

            {/* Favorites Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Your Favorite Albums</h2>
                {favorites.length === 0 ? (
                    <p className="text-gray-500">No favorites yet.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {favorites.map((fav) => (
                            <div
                            key={fav._id}
                            onClick={() => navigate(`/album/${fav.albumId}`)}
                            style={{ cursor: "pointer" }}
                            >
                                <AlbumCard
                                album={{
                                    master_id: Number(fav.albumId),
                                    title: "View album",
                                    artist: "",
                                    coverUrl: "",
                                } as Album}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Reviews Section */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="text-gray-500">You haven’t written any reviews yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {reviews.map((review) => (
                            <li
                            key={review._id}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition"
                            >
                                <h3 className="font-semibold">{review.albumTitle}</h3>
                                <p className="text-yellow-500">⭐ {review.rating}/5</p>
                                <p className="text-gray-700 mt-1">{review.text}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
