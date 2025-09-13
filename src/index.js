// require("dotenv").config({ path: "./env" });

import dotenv from "dotenv";
import connect_db from "./db/index_db.js";
import { app } from "./app.js";
import { PORT } from "./constants.js";

dotenv.config({ path: "./env" }); // load .env variables
const port = PORT || 8000;

// Connect to MongoDB
//since i connect db in index_db with async, so connect_db will retur a promise
connect_db()
  .then(() => {
    // start server
    const server = app.listen(port, () => {
      console.log(`Server is running at port: ${port}`);
    });

    // listen for server errors
    server.on("error", (error) => {
      console.log(`Server failed to connect to db !! ${error}`);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.log(`MongoDb connection failed !!!: ${error}`);
    process.exit(1);
  });

/*

// setting data_base connection in index.js directly with normal approach
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";

const app = express();
dotenv.config({ path: "./env" });
//if-ee structure ()()
(async () => {
  try {
    // connect to database
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);

    // listen for database errors
    mongoose.connection.on("error", (error) => {
      console.log(`MongoDB connection error: ${error}`);
      throw error;
    });

    // start server
    const server = app.listen(process.env.PORT, () => {
      console.log(`app is listening on port: ${process.env.PORT}`);
    });

    // listen for server errors
    server.on("error", (error) => {
      console.log(`Server failed to start: ${error}`);
      throw error;
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    throw error; // re-throws the same error object
  }
})();

*/
