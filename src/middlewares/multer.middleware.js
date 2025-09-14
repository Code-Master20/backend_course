import multer from "multer";
// Importing multer (middleware used for handling multipart/form-data, i.e. file uploads)

// Define storage configuration for multer
const storage = multer.diskStorage({
  // 'destination' defines where uploaded files will be stored locally
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
    // cb(error, path) → here no error, and files go into "./public/temp" folder
  },

  // 'filename' defines the name the file will be saved as
  filename: function (req, file, cb) {
    cb(null, file.originalname);
    // cb(error, filename) → here no error, and file keeps its original name
  },
});

// Create multer instance with our storage configuration
export const upload = multer({
  storage,
  // Here we pass our storage engine to multer
});
