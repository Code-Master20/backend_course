import mongoose from "mongoose";
import { MONGODB_URL, DB_NAME } from "../constants.js";

const connect_db = async () => {
  try {
    const connection_instance = await mongoose.connect(
      `${MONGODB_URL}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected at host: ${connection_instance.connection.host}`
    );
  } catch (error) {
    console.error(`MongoDB connection failed: ${error}`);
    process.exit(1);
  }
};

export default connect_db;
