import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string };
}

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

    jwt.verify(token, JWT_SECRET as string, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token inválido.' });
      req.user = user as { id: string };
      next();
    });
  } catch (error) {
    res.status(401).send('Usuário não foi autenticado.');
  }
};
