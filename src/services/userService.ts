import { User, IUser } from "../models/User";

/**
 * Обновляет баланс пользователя на delta (может быть положительным или отрицательным) и возвращает обновленную модель.
 */
export async function updateUserBalance(
  telegramId: number,
  delta: number
): Promise<IUser> {
  const user = await getOrCreateUser(telegramId);
  user.balance += delta;
  await user.save();
  return user;
}

/**
 * Проверяет и помечает, использована ли первая бесплатная генерация.
 * Возвращает true, если это был первый запрос, иначе false.
 */
export async function checkAndMarkFirstGen(
  telegramId: number
): Promise<boolean> {
  const user = await getOrCreateUser(telegramId);
  const isFirst = !user.firstGenDone;
  if (isFirst) {
    user.firstGenDone = true;
    await user.save();
  }
  return isFirst;
}

export async function getOrCreateUser(telegramId: number): Promise<IUser> {
  let user = await User.findOne({ telegramId });
  if (!user) {
    user = new User({ telegramId, balance: 0, firstGenDone: false });
    await user.save();
  }
  return user;
}

export async function getUserByTelegramId(
  telegramId: number
): Promise<IUser | null> {
  return User.findOne({ telegramId });
}

export async function userIsPaid(telegramId: number): Promise<boolean> {
  const user = await getOrCreateUser(telegramId);
  return user.balance > 0;
}
