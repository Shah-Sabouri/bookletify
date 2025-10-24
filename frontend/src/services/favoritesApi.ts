import axiosClient from "./axiosClient";

export const addToFavorites = async (albumId: string) => {
    const res = await axiosClient.post("/favorites", { albumId });
    return res.data;
};
