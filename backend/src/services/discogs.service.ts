import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL = "https://api.discogs.com/database/search";

export const fetchDiscogsData = async (artist: string) => {
    const token = process.env.DISCOGS_TOKEN;

    if (!token) throw new Error("Discogs token missing in .env");

    const res = await axios.get(BASE_URL, {
        params: { q: artist, type: "release", token },
        headers: { "User-Agent": "Bookletify/1.0 +https://github.com/Shah-Sabouri" },
    });

    if (!res.data?.results) throw new Error("Invalid Response from Discogs");

    // Filter out duplicates based on master_id
    const unique = res.data.results.filter(
        (r: any, index: number, self: any[]) =>
            index === self.findIndex((t) => t.master_id === r.master_id)
    );

    return unique.map((r: any) => ({
        master_id: r.master_id,
        title: r.title,
        year: r.year,
        country: r.country,
        format: r.format,
        cover_image: r.cover_image,
        genre: r.genre,
    }));
};