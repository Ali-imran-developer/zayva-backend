const { ImageUploadUtil } = require("../helpers/cloudinary");
const Product = require("../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.json({ success: false, message: "No files uploaded" });
    }
    const uploadPromises = req.files.map(async (file) => {
      const b64 = Buffer.from(file.buffer).toString("base64");
      const url = "data:" + file.mimetype + ";base64," + b64;
      const result = await ImageUploadUtil(url);
      return result.secure_url;
    });
    const uploadedImages = await Promise.all(uploadPromises);

    res.json({
      success: true,
      images: uploadedImages,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

const addProduct = async (req, res) => {
  try {
    const { images, title, description, productType, category, brand, price, salePrice, totalStock, averageReview } = req.body;
    const newlyCreatedProduct = new Product({ images, title, description, productType, category, brand, price, salePrice, totalStock, averageReview });
    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newlyCreatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      productType,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.productType = productType || findProduct.productType;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice = salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.images = image || findProduct.images;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
