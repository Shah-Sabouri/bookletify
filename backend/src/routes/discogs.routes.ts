import express from "express";
import { query } from "express-validator";
import { getDiscogsAlbums, getDiscogsAlbumById } from "../controllers/discogs.controller";
import { validateRequest } from "../middleware/validate.middleware";

const router = express.Router();

router.get(
    "/discogs",
    [
        query("artist")
        .optional()
        .isString()
        .withMessage("Artist name must be a string"),
    ],
    validateRequest,
    getDiscogsAlbums
);

router.get(
    "/discogs/album",
    [
        query("master_id")
        .notEmpty()
        .withMessage("Query parameter 'master_id' is required")
        .isInt()
        .withMessage("master_id must be an integer"),
    ],
    validateRequest,
    getDiscogsAlbumById
);

export default router;
