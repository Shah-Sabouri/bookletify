import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (username: string, email: string, password: string) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role: "user", // Default role when registering
    });

    const token = generateToken(String(newUser._id), newUser.role);

    // Return "safe" user data without password
    const safeUser = {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
    };

    return { user: safeUser, token };
};

export const loginUser = async (username: string, password: string) => {
    const user = await User.findOne({ username });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(String(password), String(user.password));
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(String(user._id), user.role);

    const safeUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };

    return { user: safeUser, token };
};
