import Order from "../models/Order.js";

// CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { items, totalPrice, receiver } = req.body;
    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      receiver,
      paymentMethod: "cash_on_delivery",
    });
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET ALL ORDERS (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullname email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// UPDATE ORDER STATUS (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};