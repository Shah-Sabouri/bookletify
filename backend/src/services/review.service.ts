import { Review, IReview } from "../models/review.model";

export const createReview = async (albumId: string, userId: string, comment: string, rating: number): Promise<IReview> => {
    const review = new Review({ albumId, userId, comment, rating });
    return await review.save();
};

export const getReviewsByAlbum = async (albumId: string): Promise<IReview[]> => {
    return await Review.find({ albumId }).sort({ createdAt: -1 });
};

export const deleteReview = async (id: string, userId: string): Promise<IReview | null> => {
    return await Review.findOneAndDelete({ _id: id, userId });
};
