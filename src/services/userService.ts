import { IUser } from "../models/User";

export function userIsPaid(user: IUser): boolean {
  // e.g. check a flag on your User model
  // return Boolean(user.hasSubscription);
  // for now, assume everyone is “unpaid”:
  return false;
}
