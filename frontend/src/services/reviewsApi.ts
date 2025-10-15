import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://bookletify-api.onrender.com/api";

export const reviewsApi = {
    getReviews: async (albumId: string) => {
        const res = await axios.get(`${BASE_URL}/reviews${albumId}`);
        return res.data;
    },
    postReview: async (albumId: string, text: string) => {
        const res = await axios.post(`${BASE_URL}/reviews`, { albumId, text });
        return res.data;
    },
};