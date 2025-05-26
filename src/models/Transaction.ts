import { Schema, model, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  engineId?: Types.ObjectId;
  type: "topup" | "generation" | "cashback";
  amount: number;
  createdAt: Date;
}

const TranSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  engineId: {
    type: Schema.Types.ObjectId,
    ref: "EngineAccount",
    required: false,
  },
  type: {
    type: String,
    enum: ["topup", "generation", "cashback"],
    required: true,
  },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Transaction = model<ITransaction>("Transaction", TranSchema);
