import React from "react";
import { Link } from "react-router-dom";
import type { Album } from "../types/album";

const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
    if (!album) return null;

    const {
        master_id,
        title,
        year,
        country,
        format,
        cover_image,
        genre,
    } = album;

    return (
        <Link
            to={`/album/${master_id}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <div
                style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    width: "200px",
                    borderRadius: "10px",
                    margin: "10px",
                    cursor: "pointer",
                    boxShadow: "0 0 0 rgba(0,0,0,0)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    backgroundColor: "#fff",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 0 0 rgba(0,0,0,0)";
                }}
            >
                {cover_image && (
                    <img
                        src={cover_image}
                        alt={title}
                        style={{
                            width: "100%",
                            borderRadius: "6px",
                            marginBottom: "10px",
                            objectFit: "cover",
                        }}
                    />
                )}
                <h3 style={{ margin: "0 0 4px", fontSize: "16px", fontWeight: 600 }}>
                    {title}
                </h3>
                {year && <p style={{ margin: 0, color: "#555", fontSize: "13px" }}>Year: {year}</p>}
                {country && <p style={{ margin: 0, color: "#555", fontSize: "13px" }}>Country: {country}</p>}
                {format && (
                    <p style={{ margin: 0, color: "#555", fontSize: "13px" }}>
                        Format: {format.join(", ")}
                    </p>
                )}
                {genre && (
                    <p style={{ margin: 0, color: "#555", fontSize: "13px" }}>
                        Genre: {genre.join(", ")}
                    </p>
                )}
            </div>
        </Link>
    );
};

export default AlbumCard;
