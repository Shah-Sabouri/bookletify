import React, { useState } from "react";
import { reviewsApi } from "../services/reviewsApi";
import styles from "./ReviewForm.module.css";

interface Props {
    albumId: string;
}

const ReviewForm: React.FC<Props> = ({ albumId }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await reviewsApi.postReview(albumId, comment, rating);
            setComment("");
            setRating(5);
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to post review.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>
                Rating:
                <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className={styles.select}
                >
                    {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                            {num}
                        </option>
                    ))}
                </select>
        </label>

        <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className={styles.textarea}
        />

            <button type="submit" className={styles.button}>
                Post Review
            </button>
        </form>
    );
};

export default ReviewForm;
