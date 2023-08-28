import User from "../models/user.js";
import { catchAsync } from "../middlewares.js";
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
  const { firstName, lastName, phoneNumber, email, username, password } = req.body;
  const existingUser = await User.findOne({ $or: [{ email: email }, { username: username }] });
  if (existingUser) {
    return res.status(400).json({ message: "Email or username already exists" });
  }

  let profilePicturePath;
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.files.file;
    const uniqueFilename = generateUniqueFilename();
    const ext = file.name.split(".").filter(Boolean).slice(1)
    const filePath = path.resolve(
      path.dirname("") + `/src/uploads/users/${uniqueFilename}.${ext}`
    );

    await file.mv(filePath);

    profilePicturePath = `/uploads/users/${uniqueFilename}.${ext}`;
    const hashedPassword = await bcrypt.hash(password, 10); 
    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      username: username,
      password: hashedPassword,
      profilePicture: profilePicturePath,
    });
    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.log(error);
  }
});


export const loginUser = catchAsync(async (req, res) => {
  const { identifier, password } = req.body;

  const user = await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  res.status(200).json({ message: "Login successful", user: user });
});






export const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { updatedUser } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    user.username = updatedUser.username;
    user.email = updatedUser.email;
    user.profilePicture = updatedUser.profilePicture;
    await user.save();

    res.status(200).json({ message: "User updated", user: user });
  } catch (err) {
    res.status(500).json({ message: "Invalid User Info", error: err.message });
  }
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