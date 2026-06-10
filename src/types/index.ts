import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

export type JWTPayload = JwtPayload & {
  userId: Types.ObjectId;
  sessionId?: Types.ObjectId;
};
