import jwt from "jsonwebtoken";

// ✅ Token generate karne ka helper function
export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
