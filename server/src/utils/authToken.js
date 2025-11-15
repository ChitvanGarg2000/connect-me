import jwt from "jsonwebtoken";

export const generateToken = async (payload) => {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};

export const verifyToken = (token) => {
  const decodedToken = jwt.verify(token.split("Bearer ")[1], process.env.JWT_SECRET);
  return decodedToken;
};
