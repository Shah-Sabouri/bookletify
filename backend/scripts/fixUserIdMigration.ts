import mongoose from "mongoose";
import dotenv from "dotenv";
import { Review } from "../src/models/review.model";

dotenv.config();

async function fixUserIds() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        throw new Error("Missing MONGODB_URI (or MONGO_URI) in .env");
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const reviews = await Review.find();
    let updatedCount = 0;

    for (const review of reviews) {
        if (typeof (review as any).userId === "string") {
            (review as any).userId = new mongoose.Types.ObjectId((review as any).userId);
            await review.save();
            updatedCount++;
        }
    }

    console.log(`Fixed ${updatedCount} review(s) with string userId`);
    await mongoose.disconnect();
    console.log("Migration complete!");
}

fixUserIds().catch((e) => {
    console.error(e);
    process.exit(1);
});
