import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

//note: configuration of everything will be done after app=express();
const app = express();

//we can define, which frontend will I allow to connect to my server
app.use(
  cors({
    //these are cors options
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//when user submit form in front-end, we receive data in server like this defining limit of the data
app.use(
  express.json({
    limit: "25kb",
  })
);

//when data enters the server through url

// the extended option controls how URL-encoded data is parsed. Here's the breakdown:
// extended: false -->Uses the classic querystring library to parse URL-encoded data.Can only handle simple key-value pairs.exam. --->name=John&age=25
//extended: true --->Uses the qs library for parsing.Supports rich objects and nested structures. exam. --> user[name]=John&user[age]=25  in-code-->{ user: { name: "John", age: 25 } }
app.use(
  express.urlencoded({
    extended: true,
    limit: "25kb",
  })
);

//note-> mongodb is database-model and cloud provides storage for database
//if some data coming from frontend (img, pdf, etc) and we want to store those data in our server(mongodb) instead sending them to cloud(aws) where our mongodb is connected, we use static
app.use(express.static("public"));

//cookieParser is used by server to access cookies of user's browser and to set them too
//cookie-parser is a middleware in Express that helps your server read and handle cookies sent by clients (usually browsers)
//A cookie is a small piece of data stored in the user's browser.
//Common uses:(1)Keep a user logged in (authentication) (2)Track user preferences (3)Store session IDs
app.use(cookieParser()); //this insure cookie now can be accessible with req.cookie and res.cookie

//routes import
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
//http://localhost:5000/api/v1/users/register

export { app };
