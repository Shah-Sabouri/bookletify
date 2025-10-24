import { Favorite, IFavorite } from "../models/favorite.model";

export const addFavorite = async (userId: string, albumId: string): Promise<IFavorite> => {
    const exists = await Favorite.findOne({ userId, albumId });
    if (exists) throw new Error("Album already in favorites");

    const favorite = new Favorite({ userId, albumId });
    return await favorite.save();
};

export const removeFavorite = async (userId: string, albumId: string) => {
    return await Favorite.findOneAndDelete({ userId, albumId });
};

export const getFavoritesByUser = async (userId: string) => {
    return await Favorite.find({ userId });
};
