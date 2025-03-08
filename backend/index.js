import dotenv from "dotenv";
import path from "path";
import express from "express";
import userRoutes from "./Routes/userRoutes.js";
import categoryRoutes from "./Routes/categoryRoutes.js";
import productRoutes from "./Routes/productRoutes.js";
import uploadRoutes from "./Routes/uploadsRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import connectToDB from "./config/db.js";
import cookieParser from "cookie-parser";
import passport from "passport";

dotenv.config();
connectToDB();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

const port = process.env.PORT || 5000;

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Hello World !");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.listen(port, () => console.log(`listning on port ${port}`));
