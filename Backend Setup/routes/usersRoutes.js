import express from "express";
import { userLogin, userRegister, googleAuth, getUserProfile, updateUserProfile, getAllUsers, toggleUserStatus } from "../controllers/userController.js";
import { body } from "express-validator";
import upload from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.route("/login").post(
  upload.none(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  userLogin
);

router.route("/register").post(
  upload.none(),
  body("fullname").isLength({ min: 3, max: 50 }),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  userRegister
);

router.route("/google-auth").post(googleAuth);

// ✅ protected routes
router.route("/profile").get(verifyToken, getUserProfile);
router.route("/profile").patch(verifyToken, upload.none(), updateUserProfile);

router.route("/all").get(verifyToken, verifyAdmin, getAllUsers);

router.route("/:id/toggle-status").patch(verifyToken, verifyAdmin, toggleUserStatus);

export default router;