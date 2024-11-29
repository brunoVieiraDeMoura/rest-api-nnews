import { Request, Response } from 'express';
import { User } from '../schemas/userSchema';

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
    const { user, password, email } = req.body;
    const newUser = new User({ user, password, email });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar usuário', error });
  }
};
