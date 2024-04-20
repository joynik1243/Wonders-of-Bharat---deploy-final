const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "WondersOfBharat",
        allowedFormats: ["jpeg", "png", "jpg"],
        transformation: [
            { width: 900, height: 600, crop: 'fill' } // Resize image to 800x600
        ]
    }
});

module.exports = {
    cloudinary,
    storage 
}