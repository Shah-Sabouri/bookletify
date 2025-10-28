import axiosClient from "./axiosClient";

export const reviewsApi = {
    getReviews: async (albumId: string) => {
        const res = await axiosClient.get(`/reviews/${albumId}`);
        return res.data;
    },
    postReview: async (albumId: string, comment: string, rating: number) => {
        const res = await axiosClient.post("/reviews", { albumId, comment, rating });
        return res.data;
    },
    deleteReview: async (reviewId: string) => {
        const res = await axiosClient.delete(`/reviews/${reviewId}`);
        return res.data;
    }
};