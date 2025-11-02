import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { addFavorite, removeFavorite, getFavoritesByUser } from "../../services/favorite.service";
import { Favorite } from "../../models/favorite.model";
import { model, Schema } from "mongoose";

// Mock User model for populate (protect in case future populate added)
model("User", new Schema({ username: String }));

describe("Favorite Service", () => {
    let mongoServer: MongoMemoryServer;
    let userId: mongoose.Types.ObjectId;
    let albumId: string;

    const mockTitle = "Test Album";
    const mockArtist = "Test Artist";
    const mockCoverUrl = "http://test.com/cover.jpg";

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
        userId = new mongoose.Types.ObjectId();
        albumId = "12345";
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await Favorite.deleteMany({});
    });

    it("should add a favorite successfully", async () => {
        const favorite = await addFavorite(
            userId.toString(),
            albumId,
            mockTitle,
            mockArtist,
            mockCoverUrl
        );
        expect(favorite).toHaveProperty("_id");
        expect(favorite.albumId).toBe(albumId);
        expect(favorite.userId.toString()).toBe(userId.toString());
    });

    it("should not allow duplicate favorites", async () => {
        await addFavorite(userId.toString(), albumId, mockTitle, mockArtist, mockCoverUrl);
        await expect(
            addFavorite(userId.toString(), albumId, mockTitle, mockArtist, mockCoverUrl)
        ).rejects.toThrow("Album already in favorites");
    });

    it("should retrieve all favorites for a user", async () => {
        await addFavorite(userId.toString(), "album1", mockTitle, mockArtist, mockCoverUrl);
        await addFavorite(userId.toString(), "album2", mockTitle, mockArtist, mockCoverUrl);

        const favorites = await getFavoritesByUser(userId.toString());
        expect(favorites).toHaveLength(2);
        expect(favorites[0]).toHaveProperty("albumId");
    });

    it("should remove a favorite successfully", async () => {
        await addFavorite(userId.toString(), albumId, mockTitle, mockArtist, mockCoverUrl);
        const removed = await removeFavorite(userId.toString(), albumId);
        expect(removed!.albumId).toBe(albumId);
    });

    it("should throw an error when removing a non-existent favorite", async () => {
        const removed = await removeFavorite(userId.toString(), "nonexistent");
        expect(removed).toBeNull();
    });
});
