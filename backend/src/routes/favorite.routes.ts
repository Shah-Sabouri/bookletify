import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
    addToFavorites,
    removeFromFavorites,
    getUserFavorites,
} from "../controllers/favorite.controller";

const router = express.Router();

router.post("/", authenticateToken, addToFavorites); // Add favorite
router.delete("/:albumId", authenticateToken, removeFromFavorites); // Remove favorite
router.get("/", authenticateToken, getUserFavorites); // Get all favorites for logged in user

export default router;
