import { User, IUser } from "../models/User";
import { Transaction, ITransaction } from "../models/Transaction";

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

export async function updateUserBalance(
  telegramId: number,
  delta: number
): Promise<IUser> {
  const user = await getOrCreateUser(telegramId);
  user.balance += delta;
  await user.save();
  // Create transaction log
  const tx = new Transaction({
    userId: user._id,
    type: delta > 0 ? "topup" : "generation",
    amount: delta,
  } as Partial<ITransaction>);
  await tx.save();
  return user;
}

export async function userIsPaid(telegramId: number): Promise<boolean> {
  const user = await getOrCreateUser(telegramId);
  return user.balance > 0;
}

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
