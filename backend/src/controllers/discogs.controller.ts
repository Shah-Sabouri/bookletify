import { Request, Response } from "express";
import { fetchDiscogsData } from "../services/discogs.service";

export const getDiscogsAlbums = async (req: Request, res: Response) => {
    try {
        const { artist } = req.query;
        if (!artist) {
            return res.status(400).json({ error: "Missing 'artist' query parameter" });
        }

        const data = await fetchDiscogsData(artist as string);
        return res.json({ artist, releases: data });
    } catch (err: any) {
        console.error("Discogs API error: ", err.message);
        return res.status(500).json({ error: "Failed to fetch data from Discogs" });
    }
};