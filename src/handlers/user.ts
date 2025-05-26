import { Telegraf, Context } from "telegraf";
import { IUser, User } from "../models/User";

export async function ensureUser(ctx: Context): Promise<IUser> {
  const tgId = ctx.from!.id;
  let user = await User.findOne({ telegramId: tgId });
  if (!user) {
    user = await User.create({ telegramId: tgId });
  }
  return user;
}

export function registerHandlers(bot: Telegraf<Context>) {
  bot.command("start", async (ctx) => {
    const user = await ensureUser(ctx);
    await ctx.reply(`Привет! У тебя ${user.balance.toFixed(1)} ⭐`);
  });

  bot.command("balance", async (ctx) => {
    const user = await ensureUser(ctx);
    await ctx.reply(`Твой баланс: ${user.balance.toFixed(1)} ⭐`);
  });
}
