import { Request, Response } from 'express';
import { User } from '../schemas/userSchema';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { AuthRequest } from '../middlewares/authToken';

const JWT_SECRET = process.env.JWT_SECRET;

export const getUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user)
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados do usuário.' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;
    const usernameExist = await User.findOne({ username });
    const emailExist = await User.findOne({ email });

    if (usernameExist || emailExist) {
      return res.status(400).json({ msg: 'Usuário ou email já cadastrados.' });
    }

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
    const token = jwt.sign({ id: user.id }, JWT_SECRET!, {
      expiresIn: '24h',
    });

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { username, email, password } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({ message: 'Usuário atualizado com sucesso.', user });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao atualizar usuário.', details: error });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    await User.deleteOne({ _id: userId });

    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário.', details: error });
  }
};
