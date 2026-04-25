import express from "express";
import Review from "../models/Review.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load reviews",
      error: error.message,
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product, rating and comment are required",
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      name: req.user.name || "Customer",
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Review failed",
      error: error.message,
    });
  }
});

export default router;