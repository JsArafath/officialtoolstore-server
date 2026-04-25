import express from "express";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// My Orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch my orders" });
  }
});

// Admin: All Orders
router.get("/admin-orders", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email role")
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch admin orders" });
  }
});

// Single Order
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
});

export default router;