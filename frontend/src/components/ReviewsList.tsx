import React, { useEffect, useState } from "react";
import { reviewsApi } from "../services/reviewsApi";
import { useAuth } from "../context/useAuth";

interface Props {
    albumId: string;
    onDelete?: (reviewId: string) => void;
}
interface Review {
    _id: string;
    userId?: { username: string };
    rating: number;
    comment: string;
}

const ReviewsList: React.FC<Props> = ({ albumId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const [undoReview, setUndoReview] = useState<Review | null>(null);
    const { user } = useAuth();

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2000);
    };

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                const res = await reviewsApi.getReviews(albumId);
                setReviews(res);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            }
            setLoading(false);
        };
        fetchReviews();
    }, [albumId]);

    const handleDelete = async (review: Review) => {
        if (!window.confirm("Delete this review?")) return;

        // remove from UI immediately
        setReviews(prev => prev.filter(r => r._id !== review._id));
        setUndoReview(review);
        showToast("Review deleted — Undo?");

        // give 2 seconds for undo
        setTimeout(async () => {
            if (undoReview && undoReview._id === review._id) return; // undo done
            await reviewsApi.deleteReview(review._id);
            setUndoReview(null);
        }, 2000);
    };

    const undo = () => {
        if (undoReview) {
            setReviews(prev => [...prev, undoReview]);
            setUndoReview(null);
            showToast("Undo successful ✅");
        }
    };

    if (loading) return <p>Loading reviews...</p>;
    if (!reviews.length) return <p>No reviews yet.</p>;

    return (
        <div style={{ marginTop: "20px", position: "relative" }}>
            {toast && (
                <div style={{
                    position: "fixed",
                    top: "80px",
                    right: "20px",
                    background: "#333",
                    color: "white",
                    padding: "10px",
                    borderRadius: "6px",
                    zIndex: 1000
                }}>
                    {toast}
                    {undoReview && (
                        <button onClick={undo} style={{ marginLeft: "10px", color: "#4af" }}>Undo</button>
                    )}
                </div>
            )}

            <h3 style={{ marginBottom: "10px" }}>User Reviews</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {reviews.map((r) => (
                    <li key={r._id}
                        style={{
                            background: "#f7f7f7",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "10px 14px",
                            marginBottom: "10px",
                            position: "relative",
                        }}
                    >
                        {user?.username === r.userId?.username && (
                            <button
                                onClick={() => handleDelete(r)}
                                style={{
                                    position: "absolute",
                                    right: "5px",
                                    top: "5px",
                                    border: "none",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    zIndex: 20
                                }}
                            >
                                🗑️
                            </button>
                        )}

                        <div style={{ justifyContent: "space-between" }}>
                            <strong>{r.userId?.username ?? "Anonymous"}</strong> - ⭐ {r.rating}/5
                            <span style={{ color: "#ffb400" }}></span>
                        </div>
                        <p style={{ margin: 0, color: "#333", lineHeight: 1.4 }}>
                            {r.comment}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewsList;
