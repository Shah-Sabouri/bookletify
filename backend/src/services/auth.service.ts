import bcrypt from "bcrypt";
import { users, User } from "../models/user.model";
import { generateToken } from "../utils/generateToken";

export const registerUser = async (username: string, email: string, password: string) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
        id: users.length + 1,
        username,
        email,
        password: hashedPassword,
    };

    users.push(newUser);
    const token = generateToken(newUser.id.toString());
    return { user: newUser, token };
};

export const loginUser = async (email: string, password: string) => {
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error("Invalid credentials");

    const token = generateToken(user.id.toString());
    return { user, token };
}