import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
    albumId: string;
    userId: mongoose.Types.ObjectId;
    comment: string;
    rating: number;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        albumId: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        comment: { type: String, required: true },
        rating: {
            type: Number, 
            required: true, 
            min: 1, 
            max: 5
        },
        createdAt: {
            type: Date, 
            default: Date.now
        }
    },
    { timestamps: true }
);

export const Review = mongoose.model<IReview>("Review", ReviewSchema);