
const multer = require('multer');
const path = require('path');

// Configure multer storage to handle both PDF and image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "file") { // Assuming 'file' is the field name for PDF
            cb(null, 'uploads/pdf');
        } else if (file.fieldname === "image") { // Assuming 'image' is the field name for images
            cb(null, 'uploads/images');
        }
    },
    filename: function (req, file, cb) {
        // Generate a unique filename with the appropriate file extension
        const ext = path.extname(file.originalname);
        console.log("this is the ext in store file: ", ext);
        cb(null, file.fieldname + '-' + Date.now() + ext);
    }
});

// Create a multer instance with the configured storage
const upload = multer({ storage: storage });

module.exports = upload;
