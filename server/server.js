/* eslint-disable prettier/prettier */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandler from "./middleware/errorHandler.middleware.js";
// import routes from "./routes/index.js";

dotenv.config();
const port = parseInt(process.env.PORT || "3000", 10);
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// Routes
// app.use("/api/auth", routes.authRoutes);
// app.use("/api/user", routes.userRoutes);
// app.use("/api/product", routes.productRoutes);
// app.use("/api/coupon", routes.couponRoutes);
// app.use("/api/cart", routes.cartRoutes);
// app.use("/api/payment", routes.paymentRoutes);
// app.use("/api/orders", routes.orderRoutes);
// app.use("/api/analytics", routes.analyticsRoutes);
app.get("/", (req, res) => {
  res.send("The Server is running : Use /api to Run Tests");
});

app.use(errorHandler);

app
  .listen(port, async () => {
    // await connectToDatabase();
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Backend allowed client: ${process.env.CLIENT_URL}`);
  })
  .on("error", (err) => {
    if (err.code === "EACCES") {
      console.log(`Port ${port} requires elevated privileges.`);
    } else {
      console.error("Server error:", err);
    }
  });
