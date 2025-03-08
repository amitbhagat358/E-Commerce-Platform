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
    isVerified: Boolean,
    profileImage: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
