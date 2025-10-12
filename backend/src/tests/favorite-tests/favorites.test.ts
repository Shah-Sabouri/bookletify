import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { addFavorite, removeFavorite, getFavoritesByUser } from "../../services/favorite.service";
import { Favorite } from "../../models/favorite.model";

describe("Favorite Service", () => {
    let mongoServer: MongoMemoryServer;
    let userId: mongoose.Types.ObjectId;
    let albumId: string;

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
        const favorite = await addFavorite(userId.toString(), albumId);
        expect(favorite).toHaveProperty("_id");
        expect(favorite.albumId).toBe(albumId);
        expect(favorite.userId.toString()).toBe(userId.toString());
    });

    it("should not allow duplicate favorites", async () => {
        await addFavorite(userId.toString(), albumId);
        await expect(addFavorite(userId.toString(), albumId)).rejects.toThrow("Album already in favorites");
    });

    it("should retrieve all favorites for a user", async () => {
        await addFavorite(userId.toString(), "album1");
        await addFavorite(userId.toString(), "album2");

        const favorites = await getFavoritesByUser(userId.toString());
        expect(favorites).toHaveLength(2);
        expect(favorites[0]).toHaveProperty("albumId");
    });

    it("should remove a favorite successfully", async () => {
        await addFavorite(userId.toString(), albumId);
        const removed = await removeFavorite(userId.toString(), albumId);
        expect(removed.albumId).toBe(albumId);
    });

    it("should throw an error when removing a non-existent favorite", async () => {
        await expect(removeFavorite(userId.toString(), "nonexistent")).rejects.toThrow("Favorite not found");
    });
});
