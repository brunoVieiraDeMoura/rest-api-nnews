import { Router } from 'express';
import {
  getTextBySlug,
  createTextSlug,
  getTextByMe,
  getTexts,
  deleteTextBySlug,
} from '../controllers/textController';
import { authenticateToken } from '../middlewares/authToken';

const router = Router();

router.post('/texto', authenticateToken, createTextSlug);
router.get('/texto/:slug', getTextBySlug);
router.get('/texto/me', authenticateToken, getTextByMe);
router.get('/texto', getTexts);
router.delete('/texto/:slug', authenticateToken, deleteTextBySlug);

export default router;
