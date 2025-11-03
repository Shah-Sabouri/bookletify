import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { addReview, 
    getAlbumReviews, 
    removeReview, 
    getAlbumAverageRating, 
    getUserReviews} from "../controllers/review.controller";

const router = express.Router();

router.post("/", authenticateToken, addReview);
router.get("/user", authenticateToken, getUserReviews);
router.get("/:albumId", getAlbumReviews); //PUBLIC ROUTE
router.delete("/:id", authenticateToken, removeReview);
router.get("/:id/rating", getAlbumAverageRating); // PUBLIC ROUTE

export default router;