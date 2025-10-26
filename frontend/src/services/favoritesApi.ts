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
