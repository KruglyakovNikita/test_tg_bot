// src/bot.ts
import "dotenv/config";
import { Telegraf, Markup } from "telegraf";
import "./db";
import { getOrCreateUser, getUserByTelegramId } from "./services/userService";
import { registerUserHandlers } from "./handlers/userHandler";
import { registerAiMockHandlers } from "./handlers/aiMockHandler";

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Middleware: всегда создаём/загружаем пользователя
bot.use(async (ctx, next) => {
  if (ctx.from) {
    await getOrCreateUser(ctx.from.id);
  }
  return next();
});

// Регистрация основных хендлеров
registerUserHandlers(bot);
registerAiMockHandlers(bot);

// Запуск
bot
  .launch()
  .then(() => console.log("Bot started"))
  .catch((err) => console.error("Launch error", err));
