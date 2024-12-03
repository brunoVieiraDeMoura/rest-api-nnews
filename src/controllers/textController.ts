// src/controllers/itemController.ts
import { Request, Response } from 'express';
import { Text } from '../schemas/textSchema';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const createTextSlug = async (req: AuthRequest, res: Response) => {
  try {
    const { title, text, slug, categoria } = req.body;

    const existingText = await Text.findOne({ slug });
    if (existingText) {
      return res.status(400).json({ error: 'O nome da matéria está em uso.' });
    }

    const newText = new Text({
      title,
      text,
      slug,
      categoria,
      user: req.user?.id,
    });
    await newText.save();

    res.status(201).json(newText);
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao tentar criar a matéria' });
  }
};

export const getTextBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const texto = await Text.findOne({ slug }).populate(
      'user',
      'username email',
    );
    if (!texto) {
      return res.status(404).json({ error: 'Matérias não encontradas' });
    }
    res.status(200).json(texto);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao tentar encontrar as matérias.' });
  }
};

export const getTextByMe = async (req: AuthRequest, res: Response) => {
  try {
    const texto = await Text.findOne({ user: req.user?.id });

    if (!texto) {
      return res.status(404).json({ error: 'Matérias não encontradas' });
    }
    res.status(200).json(texto);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao tentar encontrar as matérias.' });
  }
};

export const getTexts = async (req: AuthRequest, res: Response) => {
  try {
    const textos = await Text.find().populate('user', 'username email');
    res.json(textos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error });
  }
};

export const deleteTextBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const texto = await Text.findOne({ slug });
    if (!texto) {
      return res.status(404).json({ error: 'Matéria não encontrada.' });
    }

    if (texto.user.toString() !== req.user?.id) {
      return res.status(403).json({
        error: 'Acesso negado. Você não é o proprietário da matéria.',
      });
    }

    await Text.deleteOne({ _id: texto._id });

    res.status(200).json({ message: 'Matéria deletada com sucesso.' });
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Erro ao tentar deletar a matéria.', details: error });
  }
};

export const updateTextBySlug = async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, text, categoria } = req.body;
    const existingText = await Text.findOne({ slug });

    if (!existingText) {
      return res.status(404).json({ error: 'Matéria não encontrada.' });
    }
    if (existingText.user.toString() !== req.user?.id) {
      return res.status(403).json({
        error: 'Acesso negado. Você não é o proprietário da matéria.',
      });
    }
    if (title) existingText.title = title;
    if (text) existingText.text = text;
    if (categoria) existingText.categoria = categoria;

    await existingText.save();

    res.status(200).json({
      message: 'Matéria atualizada com sucesso.',
      text: existingText,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao tentar atualizar a matéria.',
      details: error,
    });
  }
};
