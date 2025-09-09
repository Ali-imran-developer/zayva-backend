const paypal = require("../helpers/paypal");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const createOrder = async (req, res) => {
  try {
    const { userId, guestId, cartId, cartItems, addressInfo, orderStatus, paymentMethod, note, pricing } = req.body;
    if ((!userId && !guestId) || !cartId || !cartItems?.length || !addressInfo || !pricing) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    const lastOrder = await Order.findOne().sort({ createdAt: -1 }).select("orderId");
    let newOrderId;
    if (!lastOrder || !lastOrder.orderId) {
      newOrderId = "#1001";
    } else {
      const lastNumber = parseInt(lastOrder.orderId.replace("#", ""), 10);
      newOrderId = `#${lastNumber + 1}`;
    }
    const order = new Order({
      orderId: newOrderId,
      userId,
      guestId,
      cartId,
      cartItems,
      addressInfo,
      paymentMethod,
      orderStatus,
      note,
      pricing,
    });
    await order.save();
    const cart = await Cart.findById(cartId);
    if (cart) {
      const orderedProductIds = cartItems.map((item) => item.productId.toString());
      cart.items = cart.items.filter((item) => !orderedProductIds.includes(item.productId.toString()));
      await cart.save();
    }
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.log("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, message: "UserId or GuestId is required" });
    }
    const isMongoId = id.match(/^[0-9a-fA-F]{24}$/);
    const filter = isMongoId ? { userId: id } : { guestId: id };
    const orders = await Order.find(filter).populate("cartItems.productId", "title images price salePrice").sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No orders found for this ID",
      });
    }
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};
