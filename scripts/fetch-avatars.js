const fs = require("fs");
const https = require("https");
const path = require("path");

const root = path.resolve(__dirname, "..");
const avatarDir = path.join(root, "assets", "avatars");
const outputFile = path.join(root, "data", "avatars.js");
const charactersFile = path.join(root, "data", "characters.js");
const roleUrl = "https://wiki.biligame.com/dwrg/%E8%A7%92%E8%89%B2";

function request(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          request(new URL(res.headers.location, url).href).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

function loadCharacterNames() {
  const source = fs.readFileSync(charactersFile, "utf8");
  const context = { window: {} };
  require("vm").runInNewContext(source, context);
  return context.window.IDV_DATA.characters.map((item) => item.name);
}

function parseAvatars(html) {
  const records = new Map();
  const rowPattern = /<tr[\s\S]*?<\/tr>/g;
  const rows = html.match(rowPattern) || [];
  for (const row of rows) {
    const nameMatch = row.match(/<td><a href="[^"]+" title="([^"]+)">/);
    const imgMatch = row.match(/<img[^>]+alt="([^"]*头像\.png)"[^>]+src="([^"]+)"/);
    const srcsetMatch = row.match(/srcset="([^"]+)"/);
    if (!nameMatch || !imgMatch) continue;
    const name = normalizeName(decodeHtml(nameMatch[1]));
    let url = decodeHtml(imgMatch[2]);
    if (srcsetMatch) {
      const srcset = decodeHtml(srcsetMatch[1]);
      const largest = srcset
        .split(",")
        .map((item) => item.trim().split(/\s+/)[0])
        .filter(Boolean)
        .pop();
      if (largest) url = largest;
    }
    records.set(name, url.startsWith("//") ? `https:${url}` : url);
  }
  return records;
}

function normalizeName(value) {
  return value.replace(/[“”"']/g, "").trim();
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function fileName(index, name) {
  const safe = name.replace(/[\\/:*?"<>|]/g, "_");
  return `${String(index + 1).padStart(2, "0")}-${safe}.png`;
}

async function main() {
  fs.mkdirSync(avatarDir, { recursive: true });
  const html = (await request(roleUrl)).toString("utf8");
  const avatars = parseAvatars(html);
  const names = loadCharacterNames();
  const manifest = {};
  const missing = [];

  for (const [index, name] of names.entries()) {
    const url = avatars.get(name);
    if (!url) {
      missing.push(name);
      continue;
    }
    const localName = fileName(index, name);
    const localPath = path.join(avatarDir, localName);
    const bytes = await request(url);
    fs.writeFileSync(localPath, bytes);
    manifest[name] = {
      file: `assets/avatars/${localName}`,
      source: url
    };
  }

  fs.writeFileSync(
    outputFile,
    `window.IDV_AVATARS = ${JSON.stringify(manifest, null, 2)};\n`,
    "utf8"
  );

  console.log(`downloaded ${Object.keys(manifest).length} avatars`);
  if (missing.length) {
    console.log(`missing: ${missing.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
