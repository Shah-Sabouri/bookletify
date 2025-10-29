import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import discogsRoutes from "./routes/discogs.routes";
import authRoutes from "./routes/auth.routes";
import reviewRoutes from "./routes/review.routes";
import favoriteRoutes from "./routes/favorite.routes";
import adminRoutes from "./routes/admin.routes";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>🎵 Bookletify Backend is Live!</h1><p>Server running smoothly 🚀</p>");
});

app.use(express.json());
app.use("/api", discogsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(3000, () => console.log(`Server running on port ${PORT}`));
});