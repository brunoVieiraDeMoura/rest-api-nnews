import { Router } from 'express';
import { createUser, getUser, loginUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authToken';

const router = Router();

router.get('/user', getUser, authenticateToken);
router.post('/user', createUser);
router.post('/login', loginUser);

export default router;
