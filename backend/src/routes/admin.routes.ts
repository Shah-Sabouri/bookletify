import express from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/admin.middleware";
import { User } from "../models/user.model";
import { deleteUser } from "../controllers/admin.controller";

const router = express.Router();

// GET ALL USERS
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});

// UPDATE USER ROLE
router.put("/users/:id/role", authenticateToken, requireAdmin, async (req, res) => {
    const { role } = req.body;
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
    res.json(user);
});

// DELETE USER + RELATED DATA
router.delete("/users/:id", authenticateToken, requireAdmin, deleteUser);

export default router;
