const Customer = require("../models/Customer");

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    if (!customers.length) {
      return res.status(200).json({ success: true, data: [] });
    }
    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.log("Error fetching customers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

module.exports = { getAllCustomers }; 