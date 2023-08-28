import express from 'express';
import {
  getAllUsers,
  signUp,
  updateUser,
  deleteUser
} from '../controllers/users.js';

const router = express.Router();

router.route('/').post(signUp).get(getAllUsers);
router.route('/:id').put(updateUser).delete(deleteUser);

export default router;
