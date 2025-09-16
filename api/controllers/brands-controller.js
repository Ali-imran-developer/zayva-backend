const Brands = require("../models/Brands");

const createBrands = async (req, res) => {
  try {
    const { id, label } = req.body;
    if (!id || !label) {
      return res.status(400).json({ success: false, message: "id and label are required" });
    }
    const existing = await Brands.findOne({ label });
    if (existing) {
      return res.status(400).json({ success: false, message: "Brand already exists" });
    }
    const newBrand = new Brands({ id, label });
    const savedBrand = await newBrand.save();
    res.status(201).json({
      success: true,
      message: "Brand created successfully",
      data: savedBrand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await Brands.find().sort({ label: 1 });
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server error" });
  }
};

// const brandOptions = [
//   { id: "dior", label: "Dior" },
//   { id: "saya", label: "SAYA" },
//   { id: "khaadi", label: "Khaadi" },
//   { id: "lv", label: "Lv" },
//   { id: "adidas", label: "Adidas" },
//   { id: "nike", label: "Nike" },
//   { id: "limelight", label: "LimeLight" },
//   { id: "ittehad", label: "Ittehad" },
//   { id: "mariab", label: "Maria.B" },
//   { id: "binsaeed", label: "Bin Saeed" },
//   { id: "ramsha", label: "Ramsha" },
//   { id: "gulahmed", label: "Gul Ahmed" },
// ];

// const seedBrands = async () => {
//   try {
//     const existing = await Brands.find({}, "label");
//     const existingLabels = existing.map(b => b.label);
//     const newBrands = brandOptions.filter(b => !existingLabels.includes(b.label));
//     if (newBrands.length > 0) {
//       await Brands.insertMany(newBrands, { ordered: false });
//       console.log(`✅ Inserted ${newBrands.length} new brands`);
//     } else {
//       console.log("⚠️ No new brands to insert");
//     }
//   } catch (error) {
//     console.error("❌ Seeder error:", error);
//   }
// };

// seedBrands();

module.exports = { createBrands, getBrands };