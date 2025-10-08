import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCOGS_TOKEN;
const BASE_URL = "https://api.discogs.com/database/search";

interface DiscogsRelease {
    id: number;
    title: string;
    year?: string;
    country?: string;
    format?: string[];
    genre?: string[];
    style?: string[];
    cover_image?: string;
    thumb?: string;
    master_id?: number;
    resource_url?: string;
}

async function fetchDiscogsReleases(artist: string, album: string): Promise<DiscogsRelease[]> {
    if (!token) throw new Error("Missing DISCOGS_TOKEN in .env file!");

    try {
        console.log("🔍 Fetching releases from Discogs...");

        const response = await axios.get(BASE_URL, {
        params: {
            artist,
            release_title: album,
            per_page: 10,
            type: "release",
        },
        headers: {
            Authorization: `Discogs token=${token}`,
            "User-Agent": "Bookletify/1.0 +https://github.com/Shah-Sabouri",
        },
        });

        // Debugga hela svaret
        if (!response.data) {
        throw new Error("No data field in response");
        }

        console.log("✅ Raw API keys:", Object.keys(response.data));

        if (!Array.isArray(response.data.results)) {
        console.error("❌ Response did not include 'results':", response.data);
        throw new Error("Invalid response structure");
        }

        // Filtrera dubbletter baserat på master_id
        const unique = new Map<number, DiscogsRelease>();
        for (const release of response.data.results) {
        if (!unique.has(release.master_id)) {
            unique.set(release.master_id, release);
        }
        }

        return Array.from(unique.values());
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
        console.error("❌ Discogs API error:", error.response?.data || error.message);
        } else if (error instanceof Error) {
        console.error("❌ Unknown error:", error.message);
        } else {
        console.error("❌ Unexpected error:", error);
        }
        return [];
    }
}

(async () => {
    const artist = "2Pac";
    const album = "2Pacalypse Now";

    const releases = await fetchDiscogsReleases(artist, album);

    if (releases.length > 0) {
        console.log("✅ Discogs API Response:");
        console.dir(releases, { depth: null });
    } else {
        console.warn("⚠️ No releases found.");
    }
})();
