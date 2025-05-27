import { Telegraf, Markup } from "telegraf";
import {
  getUserByTelegramId,
  updateUserBalance,
} from "../services/userService";

export function registerAiMockHandlers(bot: Telegraf) {
  // Меню “Изображение → Видео”
  bot.action("MENU_IMAGE", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply("Пришли картинку с подписью:", Markup.removeKeyboard());
    // Устанавливаем состояние, чтобы следующий photo попал сюда
    bot.on("photo", async (ctx2) => {
      await handleMockGeneration(ctx2, "image");
    });
  });

  // Меню “Текст → Видео”
  bot.action("MENU_TEXT", async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply("Напиши текст для генерации:", Markup.removeKeyboard());
    bot.on("text", async (ctx2) => {
      await handleMockGeneration(ctx2, "text");
    });
  });
}

// Общий обработчик “генерации”
async function handleMockGeneration(ctx: any, type: "image" | "text") {
  const telegramId = ctx.from.id;
  const user = await getUserByTelegramId(telegramId)!;
  if (!user) throw new Error("User not found");

  // Снимаем mock 10 ⭐ за генерацию
  if (user.balance < 10) {
    return ctx.reply("Недостаточно баланса, нажми “Пополнить (mock)”");
  }
  user.balance -= 10;
  await user.save();

  // Показываем “typing” и ждем 2 секунды
  await ctx.replyWithChatAction("upload_video");
  await new Promise((res) => setTimeout(res, 2000));

  // Отправляем заглушку
  const dummyUrl = "https://media.w3.org/2010/05/sintel/trailer.mp4";
  await ctx.replyWithVideo(dummyUrl, { caption: `${type} → видео (mock)` });

  // Возвращаем главное меню
  await ctx.reply(
    "Что дальше?",
    Markup.inlineKeyboard([
      Markup.button.callback("Изображение → Видео", "MENU_IMAGE"),
      Markup.button.callback("Текст → Видео", "MENU_TEXT"),
      Markup.button.callback("Баланс", "MENU_BALANCE"),
      Markup.button.callback("Пополнить (mock)", "MENU_TOPUP"),
    ])
  );
}
