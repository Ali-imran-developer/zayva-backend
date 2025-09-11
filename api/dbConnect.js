// require("dotenv").config();
// const mongoose = require("mongoose");

// const dbConnect = () => {
//   mongoose.connect(process.env.DB)
//     .then(() => {
//       console.log("Connected to database successfully!");
//     })
//     .catch((error) => {
//       console.log("Failed to connect with database:" + error);
//     });
// };

// module.exports = dbConnect;

require("dotenv").config();
const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 50000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 50000,
    });
    console.log("Connected to database successfully!");
  } catch (error) {
    console.error("❌ Failed to connect with database:", error.message);
    process.exit(1);
  }
};

module.exports = dbConnect;