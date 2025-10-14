import React from "react";
import type { Album } from "../types/album";

const AlbumCard: React.FC<Album> = ({
    title,
    year,
    country,
    format,
    cover_image,
    genre
}) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", width: "200px", margin: "10px" }}>
        {cover_image && <img src={cover_image} alt={title} style={{ width: "100%" }} />}
        <h3>{title}</h3>
        {year && <p>Year: {year}</p>}
        {country && <p>Country: {country}</p>}
        {format && <p>Format: {format.join(", ")}</p>}
        {genre && <p>Genre: {genre.join(", ")}</p>}
        </div>
    );
}

export default AlbumCard;