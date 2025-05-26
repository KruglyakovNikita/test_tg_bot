import { Telegraf, Context } from "telegraf";
import { selectEngine } from "../services/engineSelector";
import { ensureUser } from "../handlers/user";
import { applyCashback, chargeForGeneration } from "./payment";
import { generateImageToVideo, generateTextToVideo } from "./aiService";
import { userIsPaid } from "./userService";
import { Message } from "telegraf/typings/core/types/typegram";

export function registerAiHandlers(bot: Telegraf<Context>) {
  bot.action("GEN_IMAGE", async (ctx: Context) => {
    const user = await ensureUser(ctx);
    try {
      const engine = await selectEngine("image", userIsPaid(user));
      const cost = chargeForGeneration(user, engine);
      await user.save();

      const videoUrl = await generateImageToVideo(engine.apiKey, ctx);

      await applyCashback(user, cost);
      await ctx.replyWithVideo(videoUrl);
    } catch (e: any) {
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

  bot.action("GEN_TEXT", async (ctx: Context) => {
    const user = await ensureUser(ctx);
    try {
      const engine = await selectEngine("image", userIsPaid(user));
      const cost = chargeForGeneration(user, engine);
      await user.save();

      const textMsg = ctx.text as Message.TextMessage | undefined;
      const userText = textMsg?.text;
      if (!userText) {
        return ctx.reply("Надо написать текст для генерации.");
      }

      const videoUrl = await generateTextToVideo(engine.apiKey, userText);
      await applyCashback(user, cost);
      await ctx.replyWithVideo(videoUrl);
    } catch (e: any) {
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
}
