
import express from "express";
import bookRoutes from "./routes/bookRoutes.js";  
import userRoutes from "./routes/usersRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";


const app = express();
dotenv.config(
  {
    quiet: true
  }
);
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT) || 5000;

const normalizedFrontendUrl = (process.env.FRONTEND_URL || "")
  .trim()
  .replace(/^"+|"+$/g, "");

const envOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim().replace(/^"+|"+$/g, ""))
  .filter(Boolean);

const allowedOriginsSet = new Set([normalizedFrontendUrl, ...envOrigins].filter(Boolean));

if (NODE_ENV !== "production") {
  allowedOriginsSet.add("http://localhost:5173");
  allowedOriginsSet.add("http://127.0.0.1:5173");
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser clients (curl/postman) and same-origin requests.
      if (!origin) return callback(null, true);
      if (allowedOriginsSet.has(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello World",
  });
});

app.get("/health", (req, res) => {
  return res.status(200).json({ ok: true, env: NODE_ENV });
});

//middleware
 app.use('/api/books', bookRoutes);
 app.use('/api/users', userRoutes);
 app.use("/api/orders", orderRoutes);

 app.use((err, req, res, next) => {
  console.log("GLOBAL ERROR:", err.message);
  if (err?.message?.startsWith("CORS blocked for origin:")) {
    return res.status(403).json({ message: err.message });
  }
  res.status(500).json({ message: err.message });
});

mongoose.connect(process.env.DB_URL).then((val) => {
  app.listen(PORT, () => {
  console.log("Connected to MongoDB");
  console.log(`Server is running on port ${PORT}`);
});
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});






