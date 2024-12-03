import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  loginUser,
  updateUser,
} from '../controllers/userController';
import { authenticateToken } from '../middlewares/authToken';

const router = Router();

router.get('/user/me', authenticateToken, getUser);
router.post('/user', createUser);
router.post('/login', loginUser);
router.put('/user/me', authenticateToken, updateUser);
router.delete('/user/me', authenticateToken, deleteUser);

export default router;
