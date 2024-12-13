
// Configure storage


// File filter for validation (optional)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Only images are allowed!'), false); // Reject file
    }
};

// Multer middleware
const upload = multer({
    storage,
    fileFilter,

});

export default upload;
