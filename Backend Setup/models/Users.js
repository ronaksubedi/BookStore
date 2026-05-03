import mongoose from "mongoose";

export const USER_ROLES = [
  "admin",
  "user",
];

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "user",
    },
    isActive: {
    type: Boolean,
    default: true,
},
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
export default User;
