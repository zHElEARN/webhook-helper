const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error("Admin credentials are not set in environment variables.");
}

export { ADMIN_USERNAME, ADMIN_PASSWORD };
