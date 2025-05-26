import { Schema, model, Document } from "mongoose";

export interface IEngineAccount extends Document {
  name: string;
  apiKey: string;
  isPaid: boolean;
  isTextToVideo: boolean;
  isImageToVideo: boolean;
  dailyQuota: number;
  remainingQuota: number;
  priority: number;
  costPremium: number;
  costBackup: number;
  lengthPremium: number;
  lengthBackup: number;
}
const EngineSchema = new Schema<IEngineAccount>({
  name: String,
  apiKey: String,
  isPaid: Boolean,
  isTextToVideo: Boolean,
  isImageToVideo: Boolean,
  dailyQuota: Number,
  remainingQuota: Number,
  priority: Number,
  costPremium: Number,
  costBackup: Number,
  lengthPremium: Number,
  lengthBackup: Number,
});
export const EngineAccount = model<IEngineAccount>(
  "EngineAccount",
  EngineSchema
);
