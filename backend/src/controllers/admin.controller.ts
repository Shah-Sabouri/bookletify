import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Review } from "../models/review.model";
import { Favorite } from "../models/favorite.model";

export const getAllReviewsAdmin = async (req: Request, res: Response) => {
    try {
        const reviews = await Review.find()
        .populate("userId", "username email")
        .lean();
        
        return res.json(reviews);
    } catch (err: any) {
        return res.status(500).json({error: err.message});
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;

        // DELETE USER
        const user = await User.findByIdAndDelete(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // DELETE RELATED REVIEWS
        await Review.deleteMany({ userId });

        // DELETE RELATED REVIEWS FAVORITES
        await Favorite.deleteMany({ userId });

        return res.json({
            message: "User and all related data deleted",
            userId,
        });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};
