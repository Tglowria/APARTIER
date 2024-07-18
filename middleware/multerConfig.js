const multer = require ('multer');
const cloudinary = require('cloudinary');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.mp4', '.mov', '.avi'];
        const ext = path.extname(file.originalname);

        if (allowedExtensions.includes(ext.toLowerCase())) {
            cb(null, true);
        } else {
            cb(new Error('File type is not supported'), false);
        }
    },
});

const upload = multer({ storage });

module.exports = { upload };

