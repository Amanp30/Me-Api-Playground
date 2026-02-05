import { BASIC_AUTH_PASS, BASIC_AUTH_USER } from "../config/env_vars.js";

export function basicAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ message: "Authorization required" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8",
  );

  const [username, password] = credentials.split(":");

  if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASS) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  next(); // ✅ Authorized
}
