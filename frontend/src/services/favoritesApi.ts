import axios from "axios";
import type { Album } from "../types/album";

const BASE_URL = import.meta.env.VITE_API_URL || "https://bookletify-api.onrender.com/api";

export const addToFavorites = async (album: Album) => {
    const res = await axios.post(`${BASE_URL}/favorites`, album);
    return res.data;
};