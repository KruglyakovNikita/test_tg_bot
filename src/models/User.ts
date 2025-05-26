import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  telegramId: number;
  balance: number; // дробный для кэшбэка
  firstGenDone: boolean;
}
const UserSchema = new Schema<IUser>({
  telegramId: { type: Number, unique: true },
  balance: { type: Number, default: 0 },
  firstGenDone: { type: Boolean, default: false },
});
export const User = model<IUser>("User", UserSchema);
