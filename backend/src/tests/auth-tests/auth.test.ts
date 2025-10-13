import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { registerUser, loginUser } from "../../services/auth.service";
import { User } from "../../models/user.model";

describe("Auth Service", () => {
    let mongoServer: MongoMemoryServer;

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
        await User.deleteMany({});
    });

    it("should register a new user", async () => {
        const { user, token } = await registerUser("Shahryar", "test@example.com", "password123");

        expect(user).toHaveProperty("_id");
        expect(user.email).toBe("test@example.com");
        expect(token).toBeDefined();
    });

    it("should not allow duplicate email registration", async () => {
        await registerUser("Shahryar", "dupe@example.com", "password123");

        await expect(
            registerUser("OtherUser", "dupe@example.com", "password123")
        ).rejects.toThrow("User already exists");
    });

    it("should login with correct credentials", async () => {
        await registerUser("Shahryar", "login@example.com", "password123");

        const { user, token } = await loginUser("login@example.com", "password123");

        expect(user.email).toBe("login@example.com");
        expect(token).toBeDefined();
    });

    it("should reject login with invalid email", async () => {
        await expect(
            loginUser("noone@example.com", "password123")
        ).rejects.toThrow("Invalid credentials");
    });

    it("should reject login with wrong password", async () => {
        await registerUser("Shahryar", "wrongpass@example.com", "password123");

        await expect(
            loginUser("wrongpass@example.com", "wrongpassword")
        ).rejects.toThrow("Invalid credentials");
    });
});
