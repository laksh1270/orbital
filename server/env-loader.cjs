const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, ".env");

if (!fs.existsSync(envPath)) {
  console.error("❌ .env not found:", envPath);
  process.exit(1);
}

const data = fs.readFileSync(envPath, "utf8");

data.split(/\r?\n/).forEach((line) => {
  const l = line.trim();
  if (!l || l.startsWith("#")) return;

  const [key, ...rest] = l.split("=");
  const value = rest.join("=").trim();

  if (key && value && !process.env[key]) {
    process.env[key] = value;
  }
});
