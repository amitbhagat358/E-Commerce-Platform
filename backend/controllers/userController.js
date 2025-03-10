import User from "../schemas/userSchema.js";
import errorHandler from "../middlewares/errorHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import OTP from "../schemas/OtpSchema.js";
import otpGenerator from "otp-generator";
import crypto from "crypto";
import sendEmail from "../Utils/mailSender.js";

export const sendotp = errorHandler(async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const loginMethod = existingUser.loginMethod;
    if (loginMethod === "google") {
      return res.status(400).json({
        message: "Email is already in use.",
      });
    }

    if (loginMethod === "credentials") {
      return res.status(400).json({
        message:
          "User with given email already exists. Kindly login using the email.",
      });
    }
  }

  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  console.log("otp generated", otp);

  let result = await OTP.findOne({ otp: otp });
  while (result) {
    otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    result = await OTP.findOne({ otp: otp });
  }

  const otpBody = await OTP.create({
    email,
    otp,
  });
  console.log(otpBody);
  res.status(200).json({
    message: "otp sent successfullt",
    otp,
  });
});

export const createUserUsingCredentials = errorHandler(async (req, res) => {
  const { username, email, password, otp } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs.");
  }

  // const existingUser = await User.findOne({ email });

  // if (existingUser) {
  //   const loginMethod = existingUser.loginMethod;
  //   if (loginMethod === "google") {
  //     return res.status(400).json({
  //       message: "Email is already in use.",
  //     });
  //   }

  //   if (loginMethod === "credentials") {
  //     return res.status(400).json({
  //       message:
  //         "User with given email already exists. Kindly login using the email.",
  //     });
  //   }
  // }

  const recentOtp = await OTP.findOne({ email })
    .sort({ createdAt: -1 })
    .limit(1);

  if (!recentOtp) {
    return res.status(400).json({
      message: "otp expired",
    });
  }

  if (otp !== recentOtp.otp) {
    return res.status(400).json({
      message: "otp not matching",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    loginMethod: "credentials",
  });

  await newUser.save();

  return res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    loginMethod: "credentials",
  });
});

export const forgotPassword = errorHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  // there is no need to have change password in case of google login.
  const loginMethod = user.loginMethod;
  if (loginMethod === "google") {
    return res.status(400).json({
      message: "Use gmail login for this email address",
    });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = `You requested a password reset. Please use the following link to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.`;

  try {
    await sendEmail(email, "Password Reset Request", message);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error("Email could not be sent");
  }
});

export const resetPassword = errorHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

export const googleCallback = errorHandler(async (req, res) => {
  const user = req.user;
  const token = createToken(res, user._id);

  const queryParams = new URLSearchParams({
    token,
    user: JSON.stringify(user),
  }).toString();

  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?${queryParams}`);
});

export const credentialsLogin = errorHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res
      .status(400)
      .json({ message: "User doesn't exists for this credentials." });
  }

  const accountType = existingUser.loginMethod;
  if (accountType !== "credentials") {
    return res.status(400).json({
      message: `This account is using ${accountType} method for login. Use continue with ${accountType}`,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (isPasswordValid) {
    createToken(res, existingUser._id);

    return res.status(201).json({
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      isAdmin: existingUser.isAdmin,
    });
  }
  res.status(401).json({ message: "Invalid password" });
});

export const logoutCurrentUser = errorHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export const getAllUsers = errorHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

export const getCurrentUserProfile = errorHandler(async (req, res) => {
  console.log(req.user._id);

  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

export const updateCurrentUserProfile = errorHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const deleteUserById = errorHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

export const getUserById = errorHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUserById = errorHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
