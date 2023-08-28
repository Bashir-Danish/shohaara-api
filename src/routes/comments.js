import express from 'express';
import {
  getAllComments,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/comment.js';

const router = express.Router();

router.route('/').post(createComment).get(getAllComments);
router.route('/:id').put(updateComment).delete(deleteComment);

export default router;

