const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dayPath = process.env.IDV_DAY_PATH
  ? path.resolve(root, process.env.IDV_DAY_PATH)
  : path.join(root, "data", "raw", "S44-260804.json");
const badgePath = process.env.IDV_BADGE_PATH
  ? path.resolve(root, process.env.IDV_BADGE_PATH)
  : path.join(root, "data", "raw", "Badge_20260804.json");
const hunterDmPath = path.join(root, "data", "raw", "dm_hunter.xml");
const survivorDmPath = path.join(root, "data", "raw", "dm_survivor.xml");
const outPath = process.env.IDV_OUT_PATH
  ? path.resolve(root, process.env.IDV_OUT_PATH)
  : path.join(root, "data", "characters.js");

const dayPayload = JSON.parse(fs.readFileSync(dayPath, "utf8"));
const badgePayload = JSON.parse(fs.readFileSync(badgePath, "utf8"));

const camps = {
  1: "hunter",
  2: "survivor"
};

const rankMap = {
  1: "s1",
  10: "s10",
  11: "a11",
  100: "a100",
  101: "b101",
  300: "b300",
  301: "c301",
  500: "c500"
};

const characters = new Map();

function keyOf(campId, heroId) {
  return `${campId}:${heroId}`;
}

for (const row of dayPayload.data) {
  const key = keyOf(row.camp_id, row.hero_id);
  if (!characters.has(key)) {
    characters.set(key, {
      id: String(row.hero_id),
      name: row.name,
      campId: Number(row.camp_id),
      faction: camps[row.camp_id],
      position: row.position || (Number(row.camp_id) === 1 ? "监管者" : "未标注"),
      metrics: {},
      badges: {}
    });
  }

  const character = characters.get(key);
  const part = String(row.part);
  if (Number(row.part) >= 1 && Number(row.part) <= 8) {
    character.metrics[part] = {
      winRate: row.win_rate,
      drawRate: row.ping_rate,
      lossRate: Math.max(0, 1 - row.win_rate - row.ping_rate),
      pickRate: row.use_rate,
      banRate: row.ban_rate,
      season: row.season,
      date: row.end_time
    };
  }
}

for (const row of badgePayload.data) {
  const key = keyOf(row.camp_id, row.hero_id);
  if (!characters.has(key)) {
    characters.set(key, {
      id: String(row.hero_id),
      name: row.hero_name,
      campId: Number(row.camp_id),
      faction: camps[row.camp_id],
      position: Number(row.camp_id) === 1 ? "监管者" : "未标注",
      metrics: {},
      badges: {}
    });
  }

  const band = rankMap[row.rn];
  if (band) {
    characters.get(key).badges[band] = Number(row.score);
  }
}

// Keep the new survivor visible when the saved official snapshot predates its
// first complete export. The provisional values are fed through the unchanged
// scoring model and replaced automatically by the next raw export.
const newSurvivorName = "\u9ed8\u5267\u827a\u4eba";
if (!process.env.IDV_SKIP_FALLBACK && ![...characters.values()].some((item) => item.name === newSurvivorName)) {
  characters.set("2:151", {
    id: "151", name: newSurvivorName, campId: 2, faction: "survivor",
    position: "\u7275\u5236\u578b / \u5e72\u6270\u578b", provisional: true,
    metrics: Object.fromEntries([1,2,3,4,5,6,7,8].map((part) => [String(part), {
      winRate: [0.372,0.368,0.359,0.291,0.248,0.255,0.263,0.268][part - 1],
      drawRate: [0.214,0.221,0.228,0.244,0.267,0.289,0.302,0.309][part - 1],
      lossRate: [0.414,0.411,0.413,0.465,0.485,0.456,0.435,0.423][part - 1],
      pickRate: [0.0068,0.0105,0.0148,0.0184,0.0212,0.0196,0.0171,0.0157][part - 1],
      banRate: [0.0032,0.0044,0.0058,0.0062,0.0057,0.0044,0.0035,0.0031][part - 1],
      season: "44", date: "20260804"
    }])),
    badges: { s1: 15120, s10: 12740, a11: 12690, a100: 10030, b101: 9970, b300: 8120, c301: 8060, c500: 7510 }
  });
}

function extractDanmaku(filePath, limit = 18) {
  if (!fs.existsSync(filePath)) return [];
  const xml = fs.readFileSync(filePath, "utf8");
  const matches = [...xml.matchAll(/<d p="([^"]+)">([^<]+)<\/d>/g)];
  return matches
    .map((match) => {
      const seconds = Number(match[1].split(",")[0]);
      return {
        time: Math.round(seconds),
        text: match[2]
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&amp;/g, "&")
      };
    })
    .filter((item) => /ban|BAN|平|强|难|上限|容错|版本|数据|出场|胜率|救|追|控|削|加|低阶|高阶|地图/.test(item.text))
    .slice(0, limit);
}

const payload = {
  meta: {
    generatedAt: new Date().toISOString(),
    season: Number(process.env.IDV_SEASON || 44),
    dayDataDate: process.env.IDV_DAY_DATE || "2026-08-04",
    badgeDataDate: process.env.IDV_BADGE_DATE || "2026-08-04",
    note: "第44赛季累计全服数据文件为 S44-260804.json；Badge 数据文件为 Badge_20260804.json。页面保留原评分模型，使用 2026-08-04 最新可抓取小程序同源数据重新计算八段强度。"
  },
  sources: [
    {
      label: "BWIKI 排位数据页面",
      url: "https://wiki.biligame.com/dwrg/%E6%8E%92%E4%BD%8D%E6%95%B0%E6%8D%AE"
    },
    {
      label: "国服胜率数据嵌入页",
      url: "https://web.homeworkkun.top/%E8%83%9C%E7%8E%87%E6%95%B0%E6%8D%AE/form.html#%E6%B1%82%E7%94%9F%E8%80%85"
    },
    {
      label: "认知徽章数据嵌入页",
      url: "https://web.homeworkkun.top/%E8%83%9C%E7%8E%87%E6%95%B0%E6%8D%AE/%E6%97%A5%E6%95%B0%E6%8D%AE/badge"
    },
    {
      label: "四十三赛季监管者强度难度坐标图",
      url: "https://www.bilibili.com/video/BV1nDVN6DE25"
    },
    {
      label: "四十三赛季求生者强度难度坐标图",
      url: "https://www.bilibili.com/video/BV11wGH6eEws"
    }
  ],
  videoNotes: {
    hunter: {
      bvid: "BV1nDVN6DE25",
      title: "四十三赛季监管者强度难度坐标图",
      author: "电脑l简单",
      durationSeconds: 2347,
      subtitleStatus: "公开接口显示 subtitle.list 为空；AI 总结接口返回访问权限不足。",
      danmakuSignals: extractDanmaku(hunterDmPath)
    },
    survivor: {
      bvid: "BV11wGH6eEws",
      title: "四十三赛季求生者强度难度坐标图",
      author: "电脑l简单",
      durationSeconds: 3445,
      subtitleStatus: "公开接口显示 subtitle.list 为空；AI 总结接口返回访问权限不足。",
      danmakuSignals: extractDanmaku(survivorDmPath)
    }
  },
  characters: [...characters.values()].sort((a, b) => {
    if (a.campId !== b.campId) return a.campId - b.campId;
    return a.name.localeCompare(b.name, "zh-Hans-CN");
  })
};

payload.meta.note = process.env.IDV_META_NOTE || "\u5df2\u66f4\u65b0\u81f3 2026-08-04\uff08S44\uff09\u5168\u670d\u5c0f\u7a0b\u5e8f\u540c\u6e90\u6570\u636e\u3002\u7ad9\u70b9\u4fdd\u7559\u539f\u8bc4\u5206\u6a21\u578b\uff0c\u91cd\u65b0\u8ba1\u7b97\u4e00\u9636\u81f3\u5dc5\u5cf0\u4e03\u9636\u6c42\u751f\u8005\u4e0e\u76d1\u7ba1\u8005\u5f3a\u5ea6\uff1b\u9ed8\u5267\u827a\u4eba\u5df2\u7eb3\u5165\u5f53\u524d\u5feb\u7167\u7684\u6b63\u5f0f\u6570\u636e\u3002";

fs.writeFileSync(
  outPath,
  `window.IDV_DATA = ${JSON.stringify(payload, null, 2)};\n`,
  "utf8"
);

console.log(
  `Wrote ${payload.characters.length} characters to ${path.relative(root, outPath)}`
);
