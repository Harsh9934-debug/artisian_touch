require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { clerkMiddleware, requireAuth } = require("@clerk/express");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopWishlistRouter = require("./routes/shop/wishlist-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");
const clerkWebhooksRouter = require("./routes/webhooks/clerk-webhooks");

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

// Webhooks must be parsed as raw buffers before express.json()
app.use("/api/webhooks", clerkWebhooksRouter);

app.use(express.json());

// Apply Clerk Middleware to populate req.auth
app.use(clerkMiddleware());

// Enforce that any route expecting a userId interacts with the correct session user
const enforceOwnership = (req, res, next) => {
  const requestUserId = req.body.userId || req.params.userId;
  if (requestUserId && requestUserId !== req.auth.userId) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

const protect = [requireAuth(), enforceOwnership];

// API Routes
app.use("/api/admin/products", protect, adminProductsRouter);
app.use("/api/admin/orders", protect, adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);

app.use("/api/shop/cart", protect, shopCartRouter);
app.use("/api/shop/address", protect, shopAddressRouter);
app.use("/api/shop/order", protect, shopOrderRouter);
app.use("/api/shop/wishlist", protect, shopWishlistRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
// Trigger backend nodemon restart
// restart Sat Feb 21 15:04:55 IST 2026
