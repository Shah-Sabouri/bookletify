import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Access denied, no token provided"});
    }

    try {
        const secret = process.env.JWT_SECRET!;
        const decoded = jwt.verify(token, secret) as { id: string };

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        (req as any).user = decoded; // Makes user accessible for next middleware
        next();
    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({ error: "Invalid/expired token"});
    }
};