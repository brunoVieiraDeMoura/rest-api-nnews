import mongoose, { Schema, Document } from 'mongoose';

type IUser = Document & {
  user: string;
  email: string;
  password: string;
};

const UserSchema: Schema = new Schema({
  user: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema);
