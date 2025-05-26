import { Telegraf, Context } from "telegraf";
import { selectEngine } from "../services/engineSelector";
import { ensureUser } from "../handlers/user";
import { applyCashback, chargeForGeneration } from "./payment";

export function registerAiHandlers(bot: Telegraf<Context>) {
  bot.action("GEN_IMAGE", async (ctx) => {
    const user = await ensureUser(ctx);
    try {
      const engine = await selectEngine("image", userIsPaid(user));
      const cost = chargeForGeneration(user, engine);
      await user.save();
      // здесь вызов engineApi.generateImageToVideo(...)
      const videoUrl = await generateImageToVideo(engine.apiKey, ctx);
      await applyCashback(user, cost);
      await ctx.replyWithVideo(videoUrl);
    } catch (e) {
      if (e.message === "INSUFFICIENT_FUNDS") {
        return ctx.reply(`Недостаточно ⭐. Пополните баланс.`);
      }
      if (e.message === "NO_ENGINES") {
        return ctx.reply(`Все квоты исчерпаны, попробуйте позже.`);
      }
      console.error(e);
      return ctx.reply(`Ошибка генерации, попробуйте позже.`);
    }
  });

  bot.action("GEN_TEXT", async (ctx) => {
    // аналогично для text→video
  });
}
