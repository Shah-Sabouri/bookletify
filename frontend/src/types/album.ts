export interface Track {
    position: string;
    title: string;
    duration?: string;
}

export interface Album {
    master_id: number;
    title: string;
    artist?: string;
    year?: number;
    country?: string;
    format?: string[];
    cover_image?: string;
    genre?: string[];
    tracklist?: Track[];
}
