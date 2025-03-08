import User from "../schemas/userSchema.js";
import errorHandler from "../middlewares/errorHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUserUsingCredentials = errorHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs.");
  }

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

const googleCallback = errorHandler(async (req, res) => {
  const user = req.user;
  const token = createToken(res, user._id);

  const queryParams = new URLSearchParams({
    token,
    user: JSON.stringify(user),
  }).toString();

  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?${queryParams}`);
});

const credentialsLogin = errorHandler(async (req, res) => {
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

const logoutCurrentUser = errorHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httyOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = errorHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = errorHandler(async (req, res) => {
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

const updateCurrentUserProfile = errorHandler(async (req, res) => {
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

const deleteUserById = errorHandler(async (req, res) => {
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

const getUserById = errorHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = errorHandler(async (req, res) => {
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

export {
  createUserUsingCredentials,
  credentialsLogin,
  googleCallback,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
