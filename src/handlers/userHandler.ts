import { Markup, Telegraf } from "telegraf";
import { getUserByTelegramId } from "../services/userService";

export function registerUserHandlers(bot: Telegraf) {
  bot.start(async (ctx) => {
    const user = await getUserByTelegramId(ctx.from!.id);
    await ctx.reply(
      `Привет! Твой баланс: ${user!.balance.toFixed(1)} ⭐`,
      Markup.inlineKeyboard([
        Markup.button.callback("Изображение → Видео", "MENU_IMAGE"),
        Markup.button.callback("Текст → Видео", "MENU_TEXT"),
        Markup.button.callback("Баланс", "MENU_BALANCE"),
        Markup.button.callback("Пополнить (mock)", "MENU_TOPUP"),
      ])
    );
  });

  bot.action("MENU_BALANCE", async (ctx) => {
    const user = await getUserByTelegramId(ctx.from!.id);
    await ctx.answerCbQuery();
    await ctx.reply(`Твой баланс: ${user!.balance.toFixed(1)} ⭐`);
  });
}
