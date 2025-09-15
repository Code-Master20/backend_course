import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
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

export default router;
