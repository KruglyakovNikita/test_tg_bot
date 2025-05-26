import cron from "node-cron";
import { Telegraf } from "telegraf";
import { EngineAccount } from "../models/EngineAccount";
import { NotificationLog } from "../models/NotificationLog";

const bot = new Telegraf(process.env.BOT_TOKEN!);
const ADMIN_CHAT = process.env.ADMIN_CHAT_ID!;

cron.schedule("0 */3 * * *", async () => {
  const engines = await EngineAccount.find();
  for (const eng of engines) {
    const log =
      (await NotificationLog.findOne({ engineId: eng._id })) ??
      (await NotificationLog.create({ engineId: eng._id, sentCount: 0 }));
    const lowThreshold = eng.priority <= 3 ? 10 : 5;
    if (eng.remainingQuota <= 0 && log.sentCount < 1) {
      await bot.telegram.sendMessage(ADMIN_CHAT, `🚨 ${eng.name} исчерпан`);
      log.sentCount++;
      log.notifyType = "quota_exhausted";
      log.lastSentAt = new Date();
      await log.save();
    } else if (eng.remainingQuota <= lowThreshold && log.sentCount < 3) {
      await bot.telegram.sendMessage(
        ADMIN_CHAT,
        `⚠️ ${eng.name}: осталось ${eng.remainingQuota}`
      );
      log.sentCount++;
      log.notifyType = "low_quota";
      log.lastSentAt = new Date();
      await log.save();
    }
  }
});
