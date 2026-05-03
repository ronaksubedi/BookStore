import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookStore',
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => file.fieldname + '-' + Date.now(),
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); 


export default upload;