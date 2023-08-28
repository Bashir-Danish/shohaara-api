import express from 'express';
import {
  getAllPoets,
  createPoet,
  updatePoet,
  deletePoet
} from '../controllers/poet.js';

const router = express.Router();

router.route('/').post(createPoet).get(getAllPoets);
router.route('/:id').put(updatePoet).delete(deletePoet);

export default router;
