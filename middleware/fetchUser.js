import jwt from "jsonwebtoken";
import config from "../utils/config.js";

export const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).json({ error: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, config.secretKey);
    req.user = data.user
    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate using a valid token" });
  }
  
};
