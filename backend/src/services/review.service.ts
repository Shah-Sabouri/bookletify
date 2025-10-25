import { Review, IReview } from "../models/review.model";
import mongoose from "mongoose";

export const createReview = async (albumId: string, userId: string, comment: string, rating: number, albumTitle?: string): Promise<IReview> => {
    const review = new Review({ albumId, userId, comment, rating, albumTitle });
    return await review.save();
};

export const getReviewsByAlbum = async (albumId: string): Promise<IReview[]> => {
    return await Review.find({ albumId })
    .populate("userId", "username")
    .sort({ createdAt: -1 });
};

export const deleteReview = async (id: string, userId: string): Promise<IReview | null> => {
    return await Review.findOneAndDelete({ _id: id, userId });
};

export const getAverageRatingByAlbum = async (albumId: string) => {
    const result = await Review.aggregate([
        { $match: { albumId } },
        { $group: { _id: "$albumId", averageRating: { $avg: "$rating" } } },
    ]);
    return result.length ? result[0].averageRating : null;
};

export const getReviewsByUser = async (userId: string): Promise<IReview[]> => {
    return await Review.find({ userId: new mongoose.Types.ObjectId(userId) })
    .populate("userId", "username")
    .sort({ createdAt: -1 });
};
