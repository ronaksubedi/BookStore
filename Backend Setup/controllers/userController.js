import User from "../models/Users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { randomBytes } from "crypto";
import { verifyFirebaseIdToken } from "../utils/firebaseAdmin.js";

export const userLogin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Check if user is active
    if (!user.isActive) return res.status(403).json({ message: "Your account has been deactivated. Please contact admin." });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, fullname: user.fullname, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userRegister = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, fullname } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already in use" });

    const hashPass = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashPass, fullname });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase token is required" });
    }

    const decoded = await verifyFirebaseIdToken(idToken);
    const email = decoded.email;
    const fullname = decoded.name || decoded.email?.split("@")[0] || "Google User";

    if (!email) {
      return res.status(400).json({ message: "Google account email is required" });
    }

    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      const randomPassword = randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        fullname,
        email,
        password: hashedPassword,
        authProvider: "google",
      });

      isNewUser = true;
    } else if (!user.isActive) {
      return res.status(403).json({ message: "Your account has been deactivated. Please contact admin." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: isNewUser ? "Google account created successfully" : "Google login successful",
      token,
      isNewUser,
      user: { id: user._id, email: user.email, fullname: user.fullname, role: user.role },
    });
  } catch (error) {
    console.log("GOOGLE AUTH ERROR:", error?.message || error);
    return res.status(401).json({ message: "Invalid Google sign-in" });
  }
};

// ✅ GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
  try {
    const { fullname, password } = req.body;
    const updateData = {};

    if (fullname) updateData.fullname = fullname;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Profile updated", user: updated });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//get all users for admin to manage
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ADD at bottom of userController.js
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot deactivate yourself" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ message: `User ${user.isActive ? "activated" : "deactivated"}`, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};