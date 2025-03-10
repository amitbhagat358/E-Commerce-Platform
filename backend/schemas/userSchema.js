import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },

    loginMethod: {
      type: String,
      required: true,
    },

    googleId: String,

    isVerified: {
      type: Boolean,
      default: false,
    },

    profileImage: String,

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
