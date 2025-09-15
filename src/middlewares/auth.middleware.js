// this middleware will track if user is currently loggedin or not
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

//why verifyJWT?:-because when user did log in, we provided accessToken and refreshToken to user's browser. We will just verify if "refreshToken in user-model === accessToken in loggedInUser's browser"

export const verifyJWT = asyncHandler(async (req, _, next) => {
  //mobile senerio req.cookies.accessToken is not possible, try req.header()
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //if request from mobile-app, in header: key="Authorization" value="Bearer <token>". so we are replacing Bearer and empty-space with empty string and receiving only token from the key(Authorization)

    if (!token) throw new ApiError(401, "Unauthorized Request");

    //token will be verified by process.env.ACCESS_TOKEN_SECRET
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //decodedToken has access to _id because when we created generateAccesToken() -method in user-model we passed "_id = this._id"
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    //TODO:discuss about frontend here later, for better understabding
    if (!user) throw new ApiError(401, "Unauthorized, Invalid Access Token");

    //now adding that verified user to the request-method
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
