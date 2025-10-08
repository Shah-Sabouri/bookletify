import express from "express";
import dotenv from "dotenv";
import discogsRoutes from "./routes/discogs.routes";
import authRoutes from "./routes/auth.routes";

dotenv.config();
const app = express();

app.use(express.json());
app.use("/api", discogsRoutes);
app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
