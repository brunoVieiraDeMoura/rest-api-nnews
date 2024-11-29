import mongoose from 'mongoose';
import 'dotenv/config';

export const connectDatabase = async () => {
  try {
    if (process.env.MONGO_SECRET_URI)
      await mongoose.connect(process.env.MONGO_SECRET_URI);
    console.log('🚀 Conectado ao MongoDB!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};
