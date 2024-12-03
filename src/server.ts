import express from 'express';
import 'dotenv/config';
import { connectDatabase } from './config/database';
import userRoute from './routes/userRoute';
import textoRoute from './routes/textoRoute';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*',
  }),
);
app.use(express.json());

app.use('/api', [userRoute, textoRoute]);
// app.use('/api', textoRoute);

connectDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
