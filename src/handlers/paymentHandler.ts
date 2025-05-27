import { Telegraf, Context, Markup } from "telegraf";
import { updateUserBalance } from "../services/userService";
import { LabeledPrice, Invoice } from "telegraf/typings/core/types/typegram";

/**
 * Регистрирует хендлеры для пополнения баланса через Telegram Payments API
 */
export function registerPaymentHandlers(bot: Telegraf<Context>) {
  // 1) Показ кнопки пополнения в главном меню должен вызвать invoice
  bot.action("MENU_TOPUP", async (ctx) => {
    console.log("ONE");

    await ctx.answerCbQuery();
    const prices: LabeledPrice[] = [
      { label: "100 ⭐", amount: 1 }, // 100 Stars = 10000 (минимальная единица)
    ];

    const invoice: any = {
      chat_id: ctx.chat!.id,
      title: "Покупка ⭐",
      description: "Пакет из 100 Telegram Stars",
      payload: "STARS_100",
      provider_token: "", // Пустой токен для Stars :contentReference[oaicite:0]{index=0}
      currency: "XTR", // Специальная валюта Stars :contentReference[oaicite:1]{index=1}
      prices,
      start_parameter: "buy-stars",
    };

    await ctx.replyWithInvoice(invoice);
  });

  // 2) Подтверждаем возможность оплаты
  bot.on("pre_checkout_query", async (ctx) => {
    console.log("two");

    const query = ctx.preCheckoutQuery;
    console.log(ctx);

    if (query.invoice_payload === "STARS_100") {
      await ctx.answerPreCheckoutQuery(true);
    } else {
      await ctx.answerPreCheckoutQuery(false, "Неверный payload");
    }
  });

  // 3) Обрабатываем успешный платёж
  bot.on("successful_payment", async (ctx) => {
    console.log("THREE");
    console.log(ctx);

    const payment = ctx.message?.successful_payment;
    if (!payment || payment.invoice_payload !== "STARS_100") return;
    const telegramId = ctx.from!.id;
    // Начисляем 35 звёзд (30 купленных + 5 бонусных)
    const user = await updateUserBalance(telegramId, 35);
    await ctx.reply(
      `Баланс успешно пополнен! Сейчас: ${user.balance.toFixed(1)} ⭐`,
      Markup.inlineKeyboard([
        Markup.button.callback("Изображение → Видео", "MENU_IMAGE"),
        Markup.button.callback("Текст → Видео", "MENU_TEXT"),
        Markup.button.callback("Баланс", "MENU_BALANCE"),
        Markup.button.callback("Пополнить", "MENU_TOPUP"),
      ])
    );
  });
}
