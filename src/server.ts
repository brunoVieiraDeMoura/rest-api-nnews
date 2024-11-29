import express from 'express';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
