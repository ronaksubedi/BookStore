import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    title: String,
    coverImage: String,
    newprice: Number,
    quantity: { type: Number, default: 1 },
  }],
  totalPrice: { type: Number, required: true },
  receiver: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: { type: String, default: "cash_on_delivery" },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);