import axiosClient from "./axiosClient";
import type { Album } from "../types/album";

export const discogsApi = {
    searchAlbums: async (artist: string): Promise<Album[]> => {
        const res = await axiosClient.get(`/discogs?artist=${encodeURIComponent(artist)}`);
        return res.data.releases as Album[]; // List of albums from backend
    },

    getAlbumById: async (id: string): Promise<Album> => {
        const res = await axiosClient.get(`/albums/${id}`);
        return res.data as Album;
    },
};
