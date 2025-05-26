import { Telegraf, Context, Markup } from "telegraf";
import { ensureUser } from "./user";
import { Transaction } from "../models/Transaction";

export function registerPaymentHandlers(bot: Telegraf<Context>) {
  bot.command("topup", async (ctx) => {
    const user = await ensureUser(ctx);
    await ctx.reply(
      "Выберите пакет:",
      Markup.inlineKeyboard([
        Markup.button.callback("30 ⭐ (+5 бонус)", "TOPUP_30"),
      ])
    );
  });

  bot.action("TOPUP_30", async (ctx) => {
    const user = await ensureUser(ctx);
    user.balance += 35; // 30 + 5 бонус
    await user.save();
    await Transaction.create({
      userId: user._id,
      type: "topup",
      amount: 35,
    });
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      `Баланс пополнен! Теперь: ${user.balance.toFixed(1)} ⭐`
    );
  });
}
