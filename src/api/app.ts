import "dotenv/config";
import express from "express";
import eventRoutes from "./routes/event.route";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json());

app.use("/api", eventRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
