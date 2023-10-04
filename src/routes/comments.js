import express from 'express';
import {
  getAllComments,
  createComment,
  updateComment,
  deleteComment
} from '../controllers/comment.js';

const router = express.Router();

router.route('/:postId/:userId').get(getAllComments)
router.route('/').post(createComment)
router.route('/:id').put(updateComment).delete(deleteComment);

export default router;

