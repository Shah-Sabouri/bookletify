import mongoose from "mongoose";
import dotenv from "dotenv";
import { Review } from "../src/models/review.model";

dotenv.config();

async function fixUserIds() {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    const reviews = await Review.find();
    let updatedCount = 0;

    for (const review of reviews) {
        if (typeof review.userId === "string") {
            review.userId = new mongoose.Types.ObjectId(review.userId);
            await review.save();
            updatedCount++;
        }
    }

    console.log(`✅ Fixed ${updatedCount} review(s) with string userId`);
    await mongoose.disconnect();
    console.log("Migration complete!");
}

fixUserIds().catch(console.error);
