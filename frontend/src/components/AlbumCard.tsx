import React from "react";

interface AlbumCardProps {
    title: string;
    year?: number;
    country?: string,
    format?: string[];
    cover_img?: string;
    genre?: string[];
}

const AlbumCard: React.FC<AlbumCardProps> = ({
    title,
    year,
    country,
    format,
    cover_img,
    genre
}) => {
    return (
        <div style={{ border: "1px solid #ccc", padding: "10px", width: "200px", margin: "10px" }}>
        {cover_img && <img src={cover_img} alt={title} style={{ width: "100%" }} />}
        <h3>{title}</h3>
        {year && <p>Year: {year}</p>}
        {country && <p>Country: {country}</p>}
        {format && <p>Format: {format.join(", ")}</p>}
        {genre && <p>Genre: {genre.join(", ")}</p>}
        </div>
    );
}

export default AlbumCard;