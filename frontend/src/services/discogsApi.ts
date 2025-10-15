import axiosClient from "./axiosClient";
import type { Album } from "../types/album";

export const discogsApi = {
    searchAlbums: async (artist: string): Promise<Album[]> => {
        const res = await axiosClient.get(`/discogs?artist=${encodeURIComponent(artist)}`);
        return res.data.releases as Album[]; // List of albums from backend
    },

    getAlbumById: async (masterId: number): Promise<Album> => {
        const res = await axiosClient.get(`/discogs/album?master_id=${masterId}`);
        return res.data.album as Album;
    }
};
