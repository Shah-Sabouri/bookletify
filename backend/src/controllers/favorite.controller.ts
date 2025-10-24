import { Request, Response } from "express";
import { addFavorite, removeFavorite, getFavoritesByUser } from "../services/favorite.service";

export const addToFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { albumId } = req.body;

        if (!albumId) return res.status(400).json({ error: "albumId is required" });

        const favorite = await addFavorite(userId, albumId);
        res.status(201).json({ message: "Successfully added to favorites", favorite });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const removeFromFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const albumId = req.params.albumId as string;

        const result = await removeFavorite(userId, albumId);
        if (!result) {
            return res.status(404).json({ error: "Favorite not found" })
        }

        res.json({ message: "Removed from favorites" });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const favorites = await getFavoritesByUser(userId);
        res.json(favorites);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
