import express from "express";
import { getDiscogsAlbums } from "../controllers/discogs.controller";

const router = express.Router();

router.get("/discogs", getDiscogsAlbums);

export default router;