import { EngineAccount } from "../models/EngineAccount";

export async function selectEngine(type: "text" | "image", isPaid: boolean) {
  const filter: any = { isPaid, remainingQuota: { $gt: 0 } };
  filter[type === "text" ? "isTextToVideo" : "isImageToVideo"] = true;
  const engine = await EngineAccount.findOne(filter).sort({ priority: 1 });
  if (!engine) throw new Error("NO_ENGINES");
  engine.remainingQuota--;
  await engine.save();
  return engine;
}
