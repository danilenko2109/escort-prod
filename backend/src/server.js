const fs = require("fs");
const path = require("path");

const loadEnvFromFile = () => {
  const envPath = path.join(__dirname, "../.env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const file = fs.readFileSync(envPath, "utf8");
  for (const line of file.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalIndex = trimmed.indexOf("=");
    if (equalIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalIndex).trim();
    const value = trimmed.slice(equalIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

loadEnvFromFile();

const app = require("./app");

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
