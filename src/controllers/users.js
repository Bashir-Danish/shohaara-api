import User from "../models/user.js";
import { catchAsync } from "../middlewares.js";
import Jwt from "jsonwebtoken";
import path from "path";
import bcrypt from "bcrypt";

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({ message: "", users: users });
});
function generateUniqueFilename() {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 10000);

  return `user_image_${timestamp}_${random}`;
}

export const signUp = catchAsync(async (req, res) => {
  const { firstName, lastName, phoneNumber, email, username, password } =
    req.body;
  const existingUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });

  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email or username already exists" });
  }

  try {
    let newUser = new User({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      username: username,
      password: password,
      profilePicture: "/uploads/person.jpg",
    });

    await newUser.save();

    delete newUser.password;

    console.log(newUser);
    const token = Jwt.sign({ id: newUser._id }, process.env.SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error: " + error });
  }
});

export const loginUser = catchAsync(async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { username: email }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = Jwt.sign({ id: user._id }, process.env.SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error: " + error.message });
  }
});

export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { username , phoneNumber ,email} = req.body;
  

  // try {
  //   const user = await User.findById(id);
  //   if (!user) {
  //     return res.status(404).json({ message: "User doesn't exist" });
  //   }
  //   const existingUsername = await User.findOne({
  //     username: req.body.username,
  //   });
  //   if (existingUsername && existingUsername._id.toString() !== id) {
  //     return res.status(400).json({ message: "Username already exists" });
  //   }

  //   const existingEmail = await User.findOne({ email: req.body.email });
  //   if (existingEmail && existingEmail._id.toString() !== id) {
  //     return res.status(400).json({ message: "Email already exists" });
  //   }

  //   user.username = req.body.username;
  //   user.email = req.body.email;
  //   user.phoneNumber = req.body.phoneNumber;
  //   await user.save();

  //   res.status(200).json({ message: "User updated", user: user });
  // } catch (err) {
  //   res.status(500).json({ message: "Invalid User Info", error: req.body });
  // }
    res.status(200).json({ message: req.body });

});

export const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (user) {
      await user.deleteOne();
      return res.status(200).json({ message: "User Deleted", user: user });
    }
    return res.status(404).json({ message: "User not Found" });
  } catch (err) {
    res.status(500).json({ message: "Invalid Operation" });
  }
});
