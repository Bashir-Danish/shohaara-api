import express from 'express';
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  likeUnlikePost
} from '../controllers/posts.js';

const router = express.Router();

router.route('/').post(createPost).get(getAllPosts);
router.route('/like').post(likeUnlikePost);
router.route('/:id').put(updatePost).delete(deletePost);

export default router;
