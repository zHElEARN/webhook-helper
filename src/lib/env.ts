const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error("Admin credentials are not set in environment variables.");
}

const ONEBOT_API_URL = process.env.ONEBOT_API_URL;
const ONEBOT_ACCESS_TOKEN = process.env.ONEBOT_ACCESS_TOKEN;

if (!ONEBOT_API_URL) {
  throw new Error("ONEBOT_API_URL is not set in environment variables.");
}

const WEBHOOK_ENDPOINT = process.env.WEBHOOK_ENDPOINT;
if (!WEBHOOK_ENDPOINT) {
  throw new Error("WEBHOOK_ENDPOINT is not set in environment variables.");
}

export {
  ADMIN_USERNAME,
  ADMIN_PASSWORD,
  ONEBOT_API_URL,
  ONEBOT_ACCESS_TOKEN,
  WEBHOOK_ENDPOINT,
};
