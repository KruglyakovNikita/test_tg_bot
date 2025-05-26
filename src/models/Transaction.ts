import { Schema, model, Document } from "mongoose";

export interface ITransaction extends Document {
  userId: string;
  engineId?: string;
  type: "topup" | "generation" | "cashback";
  amount: number;
  createdAt: Date;
}
const TranSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  engineId: {
    type: Schema.Types.ObjectId,
    ref: "EngineAccount",
    required: false,
  },
  type: String,
  amount: Number,
  createdAt: { type: Date, default: Date.now },
});
export const Transaction = model<ITransaction>("Transaction", TranSchema);
