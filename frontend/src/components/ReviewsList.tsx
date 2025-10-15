import React, { useEffect, useState } from "react";
import { reviewsApi } from "../services/reviewsApi";

interface Props {
    albumId: string;
}

const ReviewsList: React.FC<Props> = ({ albumId }) => {
    const [reviews, setReviews] = useState<{ user: string; text: string }[]>([]);
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
        <ul>
            {reviews.map((r, i) => (
                <li key={i}>
                <strong>{r.user}</strong>: {r.text}
                </li>
            ))}
        </ul>
    );
};

export default ReviewsList;
