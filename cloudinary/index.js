const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "UnSafe",
    allowed_formats: ["jpeg", "png", "jpg"],
    transformation: {
      height: 500,
      width: 500,
      crop: "fill",
    },
  },
});

module.exports = { cloudinary, storage };
