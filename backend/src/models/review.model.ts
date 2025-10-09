import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    albumId: string;
    userId: string;
    comment: string;
    rating: number;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        albumId: { type: String, required: true },
        userId: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
    },
    { timestamps: true }
);

export const Review = mongoose.model<IReview>("Review", ReviewSchema);