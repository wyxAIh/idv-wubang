const params = new URLSearchParams(window.location.search);
const api = window.WUBANG;

function initCharacterPage() {
  const name = params.get("name");
  const faction = params.get("faction") || "survivor";
  const part = Number(params.get("part") || 8);

  api.state.faction = faction;
  api.state.part = part;
  api.state.sort = "rank";

  const rows = api.buildRankings();
  const character = rows.find((row) => row.name === name) || rows[0];
  api.state.selectedName = character.name;

  document.title = `${character.name} | 五榜角色详情`;
  document.querySelector("#detailTitle").textContent = character.name;
  document.querySelector("#detailIntro").textContent =
    `${api.PARTS[part]}${character.faction === "hunter" ? "监管者" : "求生者"}第 ${character.rank}，这里展示完整数据分析、BP 压力、优缺点和${character.faction === "hunter" ? "监管策略" : "天赋建议"}。`;

  api.renderDetail(character);
  renderHeaderLinks();
  renderNeighborLinks(rows, character);
}

function renderHeaderLinks() {
  if (window.IDV_SELECTED_ARCHIVE !== "s43") return;
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === "index.html#rankings") link.setAttribute("href", "index.html?archive=s43#rankings");
    if (href === "index.html#model") link.setAttribute("href", "index.html?archive=s43#model");
    if (href === "index.html#environment") link.setAttribute("href", "index.html?archive=s43#environment");
  });
}

function renderNeighborLinks(rows, character) {
  const index = rows.findIndex((row) => row.name === character.name);
  const prev = rows[index - 1];
  const next = rows[index + 1];
  const link = (item, label) => {
    if (!item) return `<span class="detail-nav-disabled">${label}</span>`;
    const query = new URLSearchParams({
      name: item.name,
      faction: item.faction,
      part: String(api.state.part)
    });
    if (window.IDV_SELECTED_ARCHIVE === "s43") {
      query.set("archive", "s43");
    }
    return `<a href="character.html?${query.toString()}">${label}：${item.rank}. ${item.name}</a>`;
  };
  const backHref = window.IDV_SELECTED_ARCHIVE === "s43"
    ? "index.html?archive=s43#rankings"
    : "index.html#rankings";

  document.querySelector("#detailNav").innerHTML = `
    ${link(prev, "上一名")}
    <a href="${backHref}">返回八段榜单</a>
    ${link(next, "下一名")}
  `;
}

initCharacterPage();
