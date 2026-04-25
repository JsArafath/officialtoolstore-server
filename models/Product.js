import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },

    price: { type: Number, required: true },

    prices: {
      "1 Month": { type: Number, default: 0 },
      "3 Months": { type: Number, default: 0 },
      "6 Months": { type: Number, default: 0 },
      "1 Year": { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);