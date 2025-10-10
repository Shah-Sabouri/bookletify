import { Request, Response } from "express";
import { createReview, 
    getReviewsByAlbum, 
    deleteReview,
    getAverageRatingByAlbum } from "../services/review.service";

export const addReview = async (req: Request, res: Response) => {
    try {
        const { albumId, comment, rating } = req.body;
        const userId = (req as any).user.id;

        if (!albumId || !comment || !rating) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const review = await createReview(albumId, userId, comment, rating);
        res.status(201).json(review);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getAlbumReviews = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.albumId as string;
        const reviews = await getReviewsByAlbum(albumId);
        res.json(reviews);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const removeReview = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const userId = (req as any).user.id;
        const review = await deleteReview(id, userId);

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        res.json({ message: "Review deleted"})
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getAlbumAverageRating = async (req: Request, res: Response) => {
    try {
        const albumId = req.params.id as string;
        const average = await getAverageRatingByAlbum(albumId);

        if (average === null) {
            return res.status(404).json({ message: "No ratings found for this album" });
        }

        res.json({ albumId, averageRating: average.toFixed(2) });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};