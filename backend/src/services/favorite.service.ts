import { Favorite, IFavorite } from "../models/favorite.model";

export const addFavorite = async (
    userId: string,
    albumId: string,
    title: string,
    artist: string,
    coverUrl: string
): Promise<IFavorite> => {
    // If the album already exists in favorites
    const exists = await Favorite.findOne({ userId, albumId });
    if (exists) throw new Error("Album already in favorites");

    // Create new "favorite" object
    const favorite = new Favorite({
        userId,
        albumId,
        title,
        artist,
        coverUrl,
    });

    return await favorite.save();
};

export const removeFavorite = async (userId: string, albumId: string) => {
    return await Favorite.findOneAndDelete({ userId, albumId });
};

export const getFavoritesByUser = async (userId: string) => {
    return await Favorite.find({ userId }).sort({ createdAt: -1 });
};
