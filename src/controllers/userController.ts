import { Request, Response } from 'express';
import { User } from '../schemas/userSchema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET;

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, email });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, user: newUser.username },
      JWT_SECRET as string,
      {
        expiresIn: '24h',
      },
    );

    return res.status(201).json({ user: newUser, token });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Senha inválida' });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET as string,
      {
        expiresIn: '24h',
      },
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};
