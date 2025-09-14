import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res, next) => {
  //get user details from frontend
  //validation- insure if not empty
  //check if user is already existed:with userName && userEmail
  //check for cover_images, check for avatar
  //upload them to cloudinary, and check if avatar uploaded successfully
  //now create user object - create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  //if data coming from form-submissin and json, we extract from req.body. if from url we will see it later
  const { fullName, userName, userEmail, password } = req.body;
  console.log(`userEmail: ${userEmail}`);

  if (
    [fullName, userEmail, userName, password].some(
      (field) => field?.trim() == ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //finding existing user with userName and userEmail
  const existedUser = await User.findOne({
    $or: [{ userName }, { userEmail }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email and username already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!avatar) throw new ApiError(400, "Avatar file is required");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    userEmail,
    password,
    userName: userName.toLowerCase(),
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated)
    throw new ApiError(500, "server is busy now, can't register new user");

  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registered successfully"));
});

export { registerUser };
