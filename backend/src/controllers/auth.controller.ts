import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";
import { User } from "../models/user.model";

export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await registerUser(username, email, password);
        return res.status(201).json(result);
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        const result = await loginUser(username, password);
        return res.json(result);
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id; // hämtas från auth.middleware
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({ message: "User profile", user });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
};