import { IUser } from "../models/User";
import { IEngineAccount } from "../models/EngineAccount";
import { Transaction } from "../models/Transaction";

export function chargeForGeneration(
  user: IUser,
  engine: IEngineAccount
): number {
  const cost = !user.firstGenDone
    ? 30
    : engine.isPaid
    ? engine.costPremium
    : engine.costBackup;
  if (user.balance < cost) throw new Error("INSUFFICIENT_FUNDS");
  user.balance -= cost;
  if (!user.firstGenDone) user.firstGenDone = true;
  return cost;
}

export async function applyCashback(user: IUser, cost: number) {
  const cb = Math.round(cost * 0.05 * 10) / 10;
  user.balance += cb;
  await user.save();
  await Transaction.create({
    userId: user._id,
    type: "cashback",
    amount: cb,
  });
}
