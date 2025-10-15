import axiosClient from "./axiosClient"; // din axios-instans
import type { Album } from "../types/album";

export const discogsApi = {
    searchAlbums: async (artist: string): Promise<Album[]> => {
        const res = await axiosClient.get("/discogs", { params: { artist } });
        return res.data.releases as Album[];
    },

    getAlbumById: async (masterId: string): Promise<Album> => {
        const res = await axiosClient.get("/discogs/album", {
            params: { master_id: Number(masterId) },
        });
        return res.data.album as Album;
    }
};
