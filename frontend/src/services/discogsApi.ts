import axiosClient from "./axiosClient";

export const discogsApi = {
    searchAlbums: async (artist: string) => {
        const res = await axiosClient.get(`/discogs?artist=${encodeURIComponent(artist)}`);
        return res.data.releases; // List of albums from backend
    },
};
