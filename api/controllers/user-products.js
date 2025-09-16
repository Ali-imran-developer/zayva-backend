const Product = require("../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh", page = 1, limit = 10, search = ""  } = req.query;
    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }
    if (search) {
      filters.title = { $regex: search, $options: "i" };
    }
    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;

        break;
      case "price-hightolow":
        sort.price = -1;

        break;
      case "title-atoz":
        sort.title = 1;

        break;

      case "title-ztoa":
        sort.title = -1;

        break;

      default:
        sort.price = 1;
        break;
    }
    const options = [
      { id: "new-arrival" },
      { id: "premium-collection" },
      { id: "saya-essence" },
      { id: "emmboiered-three-pcs" },
      { id: "summer-collection" },
      { id: "others" },
    ];
    let results = {};
    for (let opt of options) {
      const optFilters = { ...filters, productType: opt.id };
      const products = await Product.find(optFilters).sort(sort).limit(10);
      if (products.length > 0) {
        results[opt.id] = products;
      }
    }
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductsByType = async (req, res) => {
  try {
    const { productType } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;
    if (!productType) {
      return res.status(400).json({ message: "productType is required" });
    }
    let filters = { productType };
    if (search) {
      filters.title = { $regex: search, $options: "i" };
    }
    const totalProducts = await Product.countDocuments(filters);
    const products = await Product.find(filters).skip((page - 1) * limit).limit(Number(limit));
    if (!products.length) {
      return res.status(200).json({ 
        success: true, 
        length: 0,
        data: [], 
        message: "No products found for this productType" 
      });
    }
    res.status(200).json({ success: true, length: totalProducts, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { 
  getFilteredProducts, 
  getProductDetails, 
  getProductsByType 
};
