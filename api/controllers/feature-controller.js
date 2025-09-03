const Feature = require("../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;
    const featureImages = new Feature({ image });
    await featureImages.save();
    res.status(201).json({
      success: true,
      data: featureImages,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const features = await Feature.find({});
    const allImages = features.flatMap(feature => feature.image || []);
    const validImages = allImages.filter(img => img && img.trim() !== "");
    const imagePromises = validImages.map(async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        return response.ok ? url : null;
      } catch (error) {
        console.error(`Error fetching image: ${url}`, error);
        return null;
      }
    });
    const checkedImages = await Promise.all(imagePromises);
    const filteredImages = checkedImages.filter(Boolean);
    res.status(200).json({
      success: true,
      data: filteredImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages };