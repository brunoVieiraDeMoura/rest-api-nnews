import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface CustomRequest extends Request {
  user: string | JwtPayload;
}
const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'token não fornecido.' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    console.log(JWT_SECRET);
    (req as CustomRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).send('usuário não foi autenticado.');
  }
};
