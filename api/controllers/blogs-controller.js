const { ImageUploadUtil } = require("../helpers/cloudinary");
const Blogs = require("../models/Blogs");

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

const createBlog = async (req, res) => {
  try {
    const blog = new Blogs(req.body);
    await blog.save();
    res.status(201).json({ success: true, message: "Blog addedd successfully", data: blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let blog;
    if (id) {
      blog = await Blogs.findById(id);
      if (!blog) {
        return res.status(404).json({ success: false, message: "Blog not found" });
      }
    } else {
      blog = await Blogs.find().sort({ createdAt: -1 });
    }
    // const blogsData = await Blogs.find().sort({ createdAt: -1 });
    // if (!blogsData) {
    //   return res.status(200).json({ success: true, data: [] });
    // }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blogs.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, message: "Blog updated successfully", data: blog });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blogs.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  handleImageUpload,
};
