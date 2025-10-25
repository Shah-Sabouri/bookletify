import React, { useState } from "react";
import { reviewsApi } from "../services/reviewsApi";

interface Props {
    albumId: string;
}

const ReviewForm: React.FC<Props> = ({ albumId }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5); // Default 5/5

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            await reviewsApi.postReview(albumId, comment, rating);
            setComment("");
            setRating(5);
            window.location.reload(); // refresh to show new review
        } catch (err) {
            console.error(err);
            alert("Failed to post review.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <label>
                Rating:
                <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{ marginLeft: "8px" }}
                >
                {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                    {num}
                    </option>
                ))}
                </select>
            </label>
            
            <br />
            <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: "300px", height: "80px", marginTop: "8px" }}
            />
            <br />
            <button type="submit" style={{ marginTop: "5px" }}>
                Post Review
            </button>
        </form>
    );
};

export default ReviewForm;
