import express from "express";
import { body } from "express-validator";
import { register, login } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";

const router = express.Router();

// REGISTER ROUTE
router.post("/register", 
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("email").notEmpty().withMessage("Valid email is required"),
        body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    ],
    validateRequest,
    register
);

// LOGIN ROUTE
router.post("/login",
    [
        body("username").notEmpty().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    validateRequest,
    login
);

// PROFILE ROUTE (PROTECTED)
router.get("/profile", authenticateToken, (req, res) => {
    const user = (req as any).user;
    res.json({ message: "User profile", user });
})

export default router;