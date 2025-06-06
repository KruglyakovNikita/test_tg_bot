import { Schema, model, Document, Types } from "mongoose";

export interface INotificationLog extends Document {
  engineId: Types.ObjectId;
  notifyType: "low_quota" | "quota_exhausted";
  sentCount: number;
  lastSentAt: Date;
}
const NotifSchema = new Schema<INotificationLog>({
  engineId: {
    type: Schema.Types.ObjectId,
    ref: "EngineAccount",
    required: true,
  },
  notifyType: String,
  sentCount: { type: Number, default: 0 },
  lastSentAt: { type: Date },
});
export const NotificationLog = model<INotificationLog>(
  "NotificationLog",
  NotifSchema
);
