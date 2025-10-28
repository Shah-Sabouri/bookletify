import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string; // hashed
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        
        role: { 
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
    },
    { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
