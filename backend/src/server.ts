import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import discogsRoutes from "./routes/discogs.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", discogsRoutes);
app.use("/api/auth", authRoutes);

const PORT = 3000;
connectDB().then(() => {
    app.listen(3000, () => console.log(`Server running on http://localhost:${3000}`));
});
