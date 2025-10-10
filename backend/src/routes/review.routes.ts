import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { addReview, getAlbumReviews, removeReview } from "../controllers/review.controller";

const router = express.Router();

router.post("/", authenticateToken, addReview);
router.get("/:albumId", authenticateToken, getAlbumReviews);
router.delete("/:id", authenticateToken, removeReview);

export default router;