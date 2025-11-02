import React from "react";
import { Link } from "react-router-dom";
import type { Album } from "../types/album";
import styles from "./AlbumCard.module.css";

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
        <Link to={`/album/${master_id}`} className={styles.cardLink}>
            <div className={styles.card}>
                {cover_image && (
                    <img
                    src={cover_image}
                    alt={title}
                    className={styles.cover}
                    />
                )}

                <h3 className={styles.title}>{title}</h3>

                {year && <p className={styles.meta}>Year: {year}</p>}
                {country && <p className={styles.meta}>Country: {country}</p>}
                {format && <p className={styles.meta}>Format: {format.join(", ")}</p>}
                {genre && <p className={styles.meta}>Genre: {genre.join(", ")}</p>}
            </div>
        </Link>
    );
};

export default AlbumCard;
