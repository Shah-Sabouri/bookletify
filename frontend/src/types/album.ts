export interface Album {
    master_id: number;
    title: string;
    year?: number;
    country?: string;
    format?: string[];
    cover_image?: string;
    genre?: string[];
}