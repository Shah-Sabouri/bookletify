import React, { useEffect, useState } from "react";
import { reviewsApi } from "../services/reviewsApi";
import { useAuth } from "../context/useAuth";
import styles from "./ReviewsList.module.css";

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

        setReviews((prev) => prev.filter((r) => r._id !== review._id));
        setUndoReview(review);
        showToast("Review deleted — Undo?");

        setTimeout(async () => {
            if (undoReview && undoReview._id === review._id) return;
            await reviewsApi.deleteReview(review._id);
            setUndoReview(null);
        }, 2000);
    };

    const undo = () => {
        if (undoReview) {
            setReviews((prev) => [...prev, undoReview]);
            setUndoReview(null);
            showToast("Undo successful ✅");
        }
    };

    if (loading) return <p>Loading reviews...</p>;
    if (!reviews.length) return <p>No reviews yet.</p>;

    return (
        <div className={styles.wrapper}>
            {toast && (
                <div className={styles.toast}>
                    {toast}
                    {undoReview && (
                        <button onClick={undo} className={styles.undoBtn}>
                            Undo
                        </button>
                    )}
                </div>
            )}

            <h3 className={styles.heading}>User Reviews</h3>

            <ul className={styles.list}>
                {reviews.map((r) => (
                    <li key={r._id} className={styles.reviewCard}>
                        {user?.username === r.userId?.username && (
                            <button
                            onClick={() => handleDelete(r)}
                            className={styles.deleteBtn}
                            >
                                🗑️
                            </button>
                            )}

                            <div className={styles.reviewHeader}>
                                <strong>{r.userId?.username ?? "Anonymous"}</strong> - ⭐ {r.rating}/5
                            </div>

                        <p className={styles.comment}>{r.comment}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReviewsList;
