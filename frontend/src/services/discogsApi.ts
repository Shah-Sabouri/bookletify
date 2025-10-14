import axiosClient from "./axiosClient";
import type { Album } from "../types/album";

export const discogsApi = {
    searchAlbums: async (artist: string): Promise<Album[]> => {
        const res = await axiosClient.get(`/api/discogs?artist=${encodeURIComponent(artist)}`);
        return res.data.releases as Album[]; // List of albums from backend
    },
};
