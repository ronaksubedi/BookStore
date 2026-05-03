import express from "express";
import { createOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, createOrder);
router.get("/my-orders", verifyToken, getUserOrders);
router.get("/all", verifyToken, verifyAdmin, getAllOrders);
router.patch("/:id/status", verifyToken, verifyAdmin, updateOrderStatus);

export default router;