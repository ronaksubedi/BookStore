
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
app.use(cors(
  {
    origin:"https://book-store-smoky-beta.vercel.app/",
    credentials: true
  }
));
app.use(express.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello World",
  });
});

//middleware
 app.use('/api/books', bookRoutes);
 app.use('/api/users', userRoutes);
 app.use("/api/orders", orderRoutes);

 app.use((err, req, res, next) => {
  console.log("GLOBAL ERROR:", err.message);
  res.status(500).json({ message: err.message });
});

mongoose.connect(process.env.DB_URL).then((val) => {
  app.listen(5000, () => {
  console.log("Connected to MongoDB");
  console.log("Server is running on port 5000");
});
}).catch((err) => {
  console.log("Error connecting to MongoDB", err);
});






