import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createReview, getReviewsByAlbum, deleteReview, getAverageRatingByAlbum } from "../../services/review.service";
import { IReview, Review } from "../../models/review.model";

describe("Review Service", () => {
    let mongoServer: MongoMemoryServer;
    let reviewId: string;
    const mockAlbumId = "album123";
    const mockUserId = "user456";

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await Review.deleteMany({});
    });

    it("should create a new review", async () => {
        const review = await createReview(mockAlbumId, mockUserId, "Great album!", 5);
        reviewId = (review._id as mongoose.Types.ObjectId).toString();

        expect(review).toHaveProperty("_id");
        expect(review.comment).toBe("Great album!");
    });

    it("should fetch reviews for an album", async () => {
        await createReview(mockAlbumId, mockUserId, "Great album!", 5);
        const reviews = await getReviewsByAlbum(mockAlbumId);
        expect(reviews.length).toBeGreaterThan(0);
        expect(reviews[0]!.albumId).toBe(mockAlbumId);
    });

    it("should calculate average rating correctly", async () => {
        await createReview(mockAlbumId, "user123", "Loved it", 5);
        await createReview(mockAlbumId, "user789", "Not bad", 3);

        const average = await getAverageRatingByAlbum(mockAlbumId);
        expect(average).not.toBeNull();
        expect(average).toBeCloseTo(4, 0);
    });

    it("should delete a review", async () => {
        const review = await createReview(mockAlbumId, mockUserId, "Will delete this", 4);
        const reviewId = (review._id as mongoose.Types.ObjectId).toString();

        const deleted = await deleteReview(reviewId, mockUserId);
        expect(deleted?._id?.toString()).toBe(reviewId);

        const reviews = await getReviewsByAlbum(mockAlbumId);
        const found = reviews.find(r => (r._id as mongoose.Types.ObjectId).toString() === reviewId);
        expect(found).toBeUndefined();
    });
});
