const express = require("express");
const { createBlog, getBlog, updateBlog, deleteBlog, handleImageUpload } = require("../controllers/blogs-controller");
const { upload } = require("../helpers/cloudinary");
const router = express.Router();

router.post("/upload-image", upload.array("blogs_file", 4), handleImageUpload);
router.post("/add", createBlog);
router.get("/get", getBlog);
router.get("/get/:id", getBlog); 
router.put("/update/:id", updateBlog);
router.delete("/delete/:id", deleteBlog);

module.exports = router;