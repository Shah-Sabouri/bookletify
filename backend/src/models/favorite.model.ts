import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
    userId: mongoose.Types.ObjectId;
    albumId: string;
    createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        albumId: { type: String, required: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const Favorite = mongoose.model<IFavorite>("Favorite", favoriteSchema);
