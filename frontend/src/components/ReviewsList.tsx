import React, { useEffect, useState } from "react";
import { reviewsApi } from "../services/reviewsApi";

interface Props {
    albumId: string;
}

interface Review {
    userId?: {username: string };
    rating: number;
    comment: string;
}

const ReviewsList: React.FC<Props> = ({ albumId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await reviewsApi.getReviews(albumId);
                setReviews(res);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [albumId]);

    if (loading) return <p>Loading reviews...</p>;
    if (!reviews.length) return <p>No reviews yet.</p>;

    return (
        <div style={{ marginTop: "20px" }}>
            <h3 style={{ marginBottom: "10px" }}>User Reviews</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {reviews.map((r, i) => (
                    <li
                        key={i}
                        style={{
                            background: "#f7f7f7",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            marginBottom: "10px",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <strong>{r.userId?.username ?? "Anonymous"}</strong>
                            <span style={{ color: "#ffb400" }}>⭐ {r.rating}/5</span>
                        </div>
                        <p style={{ margin: 0, color: "#333", lineHeight: 1.4 }}>{r.comment}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewsList;
