import express from "express";
import discogsRoutes from "./routes/discogs.routes";

const app = express();

app.use(express.json());
app.use("/api", discogsRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
