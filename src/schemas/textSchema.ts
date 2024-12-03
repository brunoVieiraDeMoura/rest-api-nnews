import mongoose, { Schema, Document } from 'mongoose';

export type IText = Document & {
  title: string;
  text: string;
  slug: string;
  categoria: string;
  user: mongoose.Schema.Types.ObjectId;
};

const TextSchema: Schema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  categoria: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const Text = mongoose.model<IText>('Item', TextSchema);
