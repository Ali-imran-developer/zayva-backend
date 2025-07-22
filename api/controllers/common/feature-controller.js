const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    console.log(image, "image");

    const featureImages = new Feature({
      image,
    });

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
    const images = await Feature.find({});
    const validImages = images.filter(image => image.image && image.image.trim() !== "");
    const imagePromises = validImages.map(async (image) => {
      const url = image.image;     
      try {
        const response = await fetch(url, { method: 'HEAD' }); 
        if (!response.ok) {
          image.image = null;
        }
      } catch (error) {
        console.error(`Error fetching image: ${url}`, error);
        image.image = null;
      }
    });

    await Promise.all(imagePromises);
    const filteredImages = validImages.filter(image => image.image);
    res.status(200).json({
      success: true,
      data: filteredImages,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = { addFeatureImage, getFeatureImages };