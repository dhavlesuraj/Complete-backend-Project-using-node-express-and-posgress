import jwt from "jsonwebtoken";
import "dotenv/config";

const secretKey = process.env.secretKey;

export const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, secretKey);
    req.user = data.user
    next();
  } catch (error) {
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }
  
};
