import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    //file has bee uploaded successfully
    console.log("File uploaded to Cloudinary:", response.url);

    fs.unlinkSync(localFilePath); // remove the locally saved temporary file from server after completion
    // console.log(response);
    return response;
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);

    try {
      if (fs.existsSync(localFilePath)) {
        await fs.promises.unlink(localFilePath); // remove the locally saved temporary file from server as the upload operation failed
      }
    } catch (unlinkError) {
      console.error("Failed to delete local file:", unlinkError.message); //if file not existed in server console error
    }

    return null;
  }
};

export { uploadOnCloudinary };
