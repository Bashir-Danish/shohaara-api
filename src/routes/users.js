import express from "express";
import {
  getAllUsers,
  signUp,
  updateUser,
  deleteUser,
  loginUser,
  uploadImage
} from "../controllers/users.js";
import { isAuthenticatedUser } from "../utils/auth.js";

const router = express.Router();

router.route("/").post(signUp).get(getAllUsers);
router.route("/login").post(loginUser);
router.route("/:id").put(isAuthenticatedUser, updateUser).delete(deleteUser);
router.route("/:id/upload").put( uploadImage);

export default router;
