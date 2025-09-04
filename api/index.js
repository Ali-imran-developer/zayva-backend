const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dbConnect = require("./dbConnect");
const serverless = require("serverless-http");
const authRouter = require("./routes/auth-routes");
const adminProductsRouter = require("./routes/admin-products");
const adminOrderRouter = require("./routes/admin-order");
const shopProductsRouter = require("./routes/user-products");
const shopCartRouter = require("./routes/cart-routes");
const shopAddressRouter = require("./routes/address-routes");
const shopOrderRouter = require("./routes/user-order");
const shopSearchRouter = require("./routes/search-routes");
const shopReviewRouter = require("./routes/review-routes");
const commonFeatureRouter = require("./routes/feature-routes");
require("dotenv").config();

const app = express();
dbConnect();
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    callback(null, origin || true);
  },
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma",],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

// app.listen(process.env.PORT, () => {
//   console.log(`Server is running on port ${process.env.PORT}`);
// });

module.exports = app;
module.exports.handler = serverless(app);