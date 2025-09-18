import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar", //note:- in frontend, avatar, this name should be same
      maxCount: 1,
    },
    {
      name: "coverImage", //note:- in frontend, coverImage, this name should be same
      maxCount: 1,
    },
  ]), //this is a middleware
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(
  verifyJWT, //this will check if user is currently logged-in
  logoutUser
);
router.route("/refrest-token").post(refreshAccessToken);
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateAccountDetails); //why patch, because update portion of an existing field::: here updating some fields of user, not complete user
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-cover-image")
  .patch(verifyJWT, upload.single("/coverImage"), updateUserCoverImage);
router.route("/channel/:userName").get(verifyJWT, getUserChannelProfile);
router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;
