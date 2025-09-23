import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"
import helmet from "helmet"
import morgan from "morgan"

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve()


if(process.env.NODE_ENV !== "production") {
  app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

}

app.set("trust proxy", 1);
app.use(helmet());
app.use(process.env.NODE_ENV !== "production" ? morgan("dev") : morgan("combined"));
app.use(express.json({ limit: "100kb" })); // Parses JSON bodies
app.use("/api", rateLimiter);

// Logging middleware
app.use((req, res, next) => {
  console.log(`Req method is ${req.method} & Req URL is ${req.url}`);
  next();
});

app.use("/api/notes", notesRoutes);

app.use(express.static(path.join(__dirname,"frontend/dist")))

if (process.env.NODE_ENV === "production") {
  app.get("*",(req,res) => {
  res.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})
}

// 404 for unknown API routes
app.use("/api", (req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong!";
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(status).json({ message });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on PORT:", PORT);
  });
});
