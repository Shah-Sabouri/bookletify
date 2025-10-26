import axiosClient from "./axiosClient";

export const addToFavorites = async (data: {
    albumId: string;
    title: string;
    artist: string;
    coverUrl: string;
}) => {
    const res = await axiosClient.post("/favorites", data);
    return res.data;
};

export const removeFromFavorites = async (albumId: string) => {
    const res = await axiosClient.delete(`/favorites/${albumId}`);
    return res.data;
};

export const getUserFavorites = async () => {
    const res = await axiosClient.get("/favorites");
    return res.data;
};
