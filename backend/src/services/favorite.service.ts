import { Favorite } from "../models/favorite.model";

export const addFavorite = async (userId: string, albumId: string) => {
    const existing = await Favorite.findOne({ userId, albumId });
    if (existing) throw new Error("Album already in favorites");

    const favorite = new Favorite({ userId, albumId });
    return await favorite.save();
};

export const removeFavorite = async (userId: string, albumId: string) => {
    const deleted = await Favorite.findOneAndDelete({ userId, albumId });
    if (!deleted) throw new Error("Favorite not found");
    return deleted;
};

export const getFavoritesByUser = async (userId: string) => {
    return await Favorite.find({ userId }).sort({ createdAt: -1 });
};
