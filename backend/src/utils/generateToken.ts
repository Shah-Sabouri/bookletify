import jwt, { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId: string, role: string): string => {
    const secret: Secret = process.env.JWT_SECRET as string;

    return jwt.sign(
        { id: userId, role },
        secret,
        { expiresIn: "1d" }
    );
};
