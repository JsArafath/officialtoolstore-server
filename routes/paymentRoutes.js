import express from "express";
import SSLCommerzPayment from "sslcommerz-lts";
import Order from "../models/Order.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/init", authMiddleware, async (req, res) => {
  try {
    const { products, totalAmount, customer } = req.body;

    const storeId = process.env.SSLC_STORE_ID;
    const storePassword = process.env.SSLC_STORE_PASSWORD;
    const isLive = process.env.SSLC_IS_LIVE === "true";

    console.log("STORE ID:", storeId);
    console.log("STORE PASSWORD EXISTS:", !!storePassword);
    console.log("IS LIVE:", isLive);

    if (!storeId || !storePassword) {
      return res.status(500).json({
        success: false,
        message: "SSLCommerz store id or password missing in .env",
      });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const transactionId = `TXN_${Date.now()}`;

    const order = await Order.create({
      user: req.user.id,
      products,
      totalAmount,
      transactionId,
      status: "pending",
      customer,
    });

    const data = {
      total_amount: Number(totalAmount),
      currency: "BDT",
      tran_id: transactionId,

      success_url: `${process.env.SERVER_URL}/api/payment/success/${transactionId}`,
      fail_url: `${process.env.SERVER_URL}/api/payment/fail/${transactionId}`,
      cancel_url: `${process.env.SERVER_URL}/api/payment/cancel/${transactionId}`,
      ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,

      shipping_method: "NO",
      product_name: products.map((p) => p.name).join(", "),
      product_category: "Digital Product",
      product_profile: "non-physical-goods",

      cus_name: customer?.name || "Customer",
      cus_email: customer?.email || "customer@gmail.com",
      cus_add1: customer?.address || "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1200",
      cus_country: "Bangladesh",
      cus_phone: customer?.phone || "01700000000",
      cus_fax: customer?.phone || "01700000000",

      ship_name: customer?.name || "Customer",
      ship_add1: customer?.address || "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "1200",
      ship_country: "Bangladesh",
    };

    const sslcz = new SSLCommerzPayment(storeId, storePassword, isLive);
    const apiResponse = await sslcz.init(data);

    console.log("SSLCommerz FULL RESPONSE:", apiResponse);

    const gatewayUrl = apiResponse?.GatewayPageURL;

    if (!gatewayUrl) {
      order.status = "failed";
      await order.save();

      return res.status(400).json({
        success: false,
        message: apiResponse?.failedreason || "Gateway URL not found",
        sslResponse: apiResponse,
      });
    }

    return res.json({
      success: true,
      gatewayUrl,
      transactionId,
    });
  } catch (error) {
    console.error("Payment init error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Payment initialization failed",
    });
  }
});

router.post("/success/:tranId", async (req, res) => {
  const { tranId } = req.params;

  await Order.findOneAndUpdate(
    { transactionId: tranId },
    { status: "paid" }
  );

  res.redirect(`${process.env.CLIENT_URL}/payment/success?tran_id=${tranId}`);
});

router.post("/fail/:tranId", async (req, res) => {
  const { tranId } = req.params;

  await Order.findOneAndUpdate(
    { transactionId: tranId },
    { status: "failed" }
  );

  res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
});

router.post("/cancel/:tranId", async (req, res) => {
  const { tranId } = req.params;

  await Order.findOneAndUpdate(
    { transactionId: tranId },
    { status: "cancelled" }
  );

  res.redirect(`${process.env.CLIENT_URL}/payment/cancel`);
});

router.post("/ipn", async (req, res) => {
  res.status(200).json({ success: true });
});

export default router;