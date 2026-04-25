import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    products: [
      {
        productId: String,
        name: String,
        price: Number,
        image: String,
        category: String,
      },
    ],

    totalAmount: { type: Number, required: true },
    transactionId: { type: String, required: true, unique: true },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled", "delivered"],
      default: "pending",
    },

    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);