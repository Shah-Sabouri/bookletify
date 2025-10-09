import express from "express";
import { query } from "express-validator";
import { getDiscogsAlbums } from "../controllers/discogs.controller";
import { validateRequest } from "../middleware/validate.middleware";

const router = express.Router();

router.get(
    "/discogs",
    [
        query("artist")
        .notEmpty()
        .withMessage("Query parameter 'artist' is required")
        .isString()
        .withMessage("Artist name must be a string"),
    ], 
    validateRequest,
    getDiscogsAlbums);

export default router;