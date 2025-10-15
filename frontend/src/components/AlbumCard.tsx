import React from "react";
import { Link } from "react-router-dom";
import type { Album } from "../types/album";

const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
    const { master_id, title, year, country, format, cover_image, genre } = album;

    if (!master_id) return null; // säkerhetskontroll

    return (
        <Link to={`/album/${master_id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
                border: "1px solid #ccc",
                padding: "10px",
                width: "200px",
                margin: "10px",
                cursor: "pointer",
            }}>
                {cover_image && <img src={cover_image} alt={title} style={{ width: "100%" }} />}
                <h3>{title}</h3>
                {year && <p>Year: {year}</p>}
                {country && <p>Country: {country}</p>}
                {format && <p>Format: {format.join(", ")}</p>}
                {genre && <p>Genre: {genre.join(", ")}</p>}
            </div>
        </Link>
    );
};

export default AlbumCard;
