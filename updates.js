const latest = window.IDV_DATA;
const archive = window.IDV_ARCHIVE;
const partNames = ["一阶", "二阶", "三阶", "四阶", "五阶", "六阶", "七阶", "巅峰七阶"];

function normalize(value, min, max) {
  if (max === min) return 50;
  return ((value - min) / (max - min)) * 100;
}

function rankTop(data, faction, part) {
  const rows = data.characters.filter((item) => item.faction === faction && item.metrics[String(part)]);
  const values = (key) => rows.map((item) => item.metrics[String(part)][key]);
  const ranges = {};
  ["winRate", "drawRate", "pickRate", "banRate"].forEach((key) => {
    const list = values(key);
    ranges[key] = [Math.min(...list), Math.max(...list)];
  });
  return rows
    .map((item) => {
      const m = item.metrics[String(part)];
      const badge = (item.badges.s1 || 0) * 0.4 + (item.badges.a100 || 0) * 0.3 + (item.badges.b300 || 0) * 0.2 + (item.badges.c500 || 0) * 0.1;
      const score =
        normalize(m.winRate, ...ranges.winRate) * 0.28 +
        normalize(m.drawRate, ...ranges.drawRate) * 0.24 +
        normalize(m.pickRate, ...ranges.pickRate) * 0.12 +
        normalize(m.banRate, ...ranges.banRate) * 0.16 +
        normalize(badge, ...[Math.min(...rows.map((r) => (r.badges.s1 || 0) * 0.4 + (r.badges.a100 || 0) * 0.3 + (r.badges.b300 || 0) * 0.2 + (r.badges.c500 || 0) * 0.1)), Math.max(...rows.map((r) => (r.badges.s1 || 0) * 0.4 + (r.badges.a100 || 0) * 0.3 + (r.badges.b300 || 0) * 0.2 + (r.badges.c500 || 0) * 0.1))]) * 0.2;
      return { ...item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

function renderVersion(data, label, tone) {
  const sections = [1, 2, 3, 4, 5, 6, 7, 8].map((part) => {
    const survivor = rankTop(data, "survivor", part).map((item) => item.name).join("、");
    const hunter = rankTop(data, "hunter", part).map((item) => item.name).join("、");
    return `<div class="update-row"><strong>${partNames[part - 1]}</strong><span>求生 ${survivor}</span><span>监管 ${hunter}</span></div>`;
  }).join("");
  const href = data === latest ? "index.html#rankings" : "index.html?archive=s43#rankings";
  const action = data === latest ? "进入当前榜单" : "进入第43赛季归档榜单";
  return `<article class="update-card ${tone}"><div class="update-card-head"><div><p class="eyebrow">${label}</p><h2>八段榜单快照</h2></div><span class="update-date">${data.meta.dayDataDate}</span></div><p>${data.meta.note}</p><div class="update-table">${sections}</div><a class="primary-action" href="${href}">${action}</a></article>`;
}

document.querySelector("#updateGrid").innerHTML =
  renderVersion(latest, "2026.08.05 · 第44赛季", "update-current") +
  renderVersion(archive, "2026.06.15 · 第43赛季", "update-archive");
