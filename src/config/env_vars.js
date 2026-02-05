import dotenv from "dotenv";
dotenv.config();

["PORT", "MONGO_URI", "ALLOWED_DOMAINS"].forEach((key) => {
  if (!process.env[key]) {
    console.error(`Environment variable ${key} is not set`);
    process.exit(1);
  }
});

const domainRegex =
  /^https?:\/\/(?:localhost|\d{1,3}(?:\.\d{1,3}){3}|([\w-]+\.)+[\w-]{2,})(:\d{1,5})?$/;

export const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS.split(",")
  .map((domain) => domain.trim())
  .filter(Boolean)
  .filter((domain) => domainRegex.test(domain));

if (ALLOWED_DOMAINS.length === 0) {
  console.error("No valid domains found in ALLOWED_DOMAINS");
  process.exit(1);
}

export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
export const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS;

