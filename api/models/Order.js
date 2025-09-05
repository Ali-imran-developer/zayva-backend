const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guestId: { type: String },
    cartId: { type: String, required: true },
    cartItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, required: true },
        image: [{ type: String, required: true }],
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    addressInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
      email: { type: String },
    },
    orderStatus: { type: String, enum: ["open", "pending", "confirmed", "delivered", "cancelled"], required: true },
    paymentMethod: { type: String, enum: ["cod", "jazzcash", "easypaisa"], required: true, default: "cod" },
    note: { type: String },
    pricing: {
      subTotal: { type: Number, required: true },
      shipping: { type: Number, required: true, default: 0 },
      totalPrice: { type: Number, required: true },
    },
  },
  { timestamps: true }
);

OrderSchema.pre("validate", function (next) {
  if (!this.userId && !this.guestId) {
    return next(new Error("Either userId or guestId is required"));
  }
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
