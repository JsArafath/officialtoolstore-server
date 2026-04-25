import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Products load failed" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Product load failed" });
  }
});

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, image, category, prices } = req.body;

    if (!name || !description || !image || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, image and category are required",
      });
    }

    const priceValues = {
      "1 Month": Number(prices?.["1 Month"] || 0),
      "3 Months": Number(prices?.["3 Months"] || 0),
      "6 Months": Number(prices?.["6 Months"] || 0),
      "1 Year": Number(prices?.["1 Year"] || 0),
    };

    const availablePrices = Object.values(priceValues).filter((p) => p > 0);

    if (availablePrices.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one duration price is required",
      });
    }

    const product = await Product.create({
      name,
      description,
      image,
      category,
      price: availablePrices[0],
      prices: priceValues,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Product add failed",
      error: error.message,
    });
  }
});

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
});

export default router;