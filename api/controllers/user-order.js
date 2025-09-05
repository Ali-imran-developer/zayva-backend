const paypal = require("../helpers/paypal");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// const createOrder = async (req, res) => {
//   try {
//     const { userId, cartItems, addressInfo, orderStatus, paymentMethod, paymentStatus, totalAmount, orderDate, orderUpdateDate, paymentId, payerId, cartId } = req.body;
//     const create_payment_json = {
//       intent: "sale",
//       payer: { payment_method: "paypal" },
//       redirect_urls: {
//         return_url: "http://localhost:5173/shop/paypal-return",
//         cancel_url: "http://localhost:5173/shop/paypal-cancel",
//       },
//       transactions: [
//         {
//           item_list: {
//             items: cartItems.map((item) => ({
//               name: item.title,
//               sku: item.productId,
//               price: item.price.toFixed(2),
//               currency: "USD",
//               quantity: item.quantity,
//             })),
//           },
//           amount: {
//             currency: "USD",
//             total: totalAmount.toFixed(2),
//           },
//           description: "description",
//         },
//       ],
//     };
//     paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
//       if (error) {
//         console.log(error);
//         return res.status(500).json({
//           success: false,
//           message: "Error while creating paypal payment",
//         });
//       } else {
//         const newlyCreatedOrder = new Order({
//           userId,
//           cartId,
//           cartItems,
//           addressInfo,
//           orderStatus,
//           paymentMethod,
//           paymentStatus,
//           totalAmount,
//           orderDate,
//           orderUpdateDate,
//           paymentId,
//           payerId,
//         });
//         await newlyCreatedOrder.save();
//         const approvalURL = paymentInfo.links.find((link) => link.rel === "approval_url").href;
//         res.status(201).json({
//           success: true,
//           approvalURL,
//           orderId: newlyCreatedOrder._id,
//         });
//       }
//     });
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({
//       success: false,
//       message: "Some error occured!",
//     });
//   }
// };

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
    const { userId, guestId } = req.query;
    if (!userId && !guestId) {
      return res.status(400).json({ success: false, message: "UserId or GuestId is required" });
    }
    const filter = userId ? { userId } : { guestId };
    const orders = await Order.find(filter).populate("cartItems.productId", "title images price salePrice").sort({ createdAt: -1 });
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
