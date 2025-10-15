import React, { useState } from "react";
import { reviewsApi } from "../services/reviewsApi";

interface Props {
    albumId: string;
}

const ReviewForm: React.FC<Props> = ({ albumId }) => {
    const [text, setText] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            await reviewsApi.postReview(albumId, text);
            setText("");
            window.location.reload(); // quick refresh to update list
        } catch (err) {
            console.error(err);
            alert("Failed to post review.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
            <textarea
            placeholder="Write your review..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ width: "300px", height: "80px" }}
            />
            <br />
            <button type="submit" style={{ marginTop: "5px" }}>
                Post Review
            </button>
        </form>
    );
};

export default ReviewForm;