// lib/token.js
import jwt from "jsonwebtoken";
import moment from "moment";

export const generateToken = async (
  userId,
  role,
  expires,
  type,
  tokenVersion,
  secret = process.env.JWT_SECRET
) => {
  const payload = {
    sub: userId,
    role,
    tokenVersion,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };

  return jwt.sign(payload, secret);
};
