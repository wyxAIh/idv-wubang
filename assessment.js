const form = document.querySelector("#fullAssessment");
const result = document.querySelector("#fullAssessmentResult");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const score = [...new FormData(form).values()].map(Number).reduce((sum, value) => sum + value, 0);
  const level = score >= 24
    ? ["环境指挥型", "你能把数据、BP、地图和阵容结构放在一起判断。下一步重点是准备两套不同地图的角色池，并记录自己在哪些对局里掉节奏。", "巅峰七阶与角色详情"]
    : score >= 17
      ? ["稳定适应型", "你掌握了多数基础概念，但遇到高胜率或高禁用数据时仍可能过早下结论。建议同时看出场率、认知分和自己的可执行熟练度。", "五至七阶榜单与评分模型"]
      : ["直觉行动型", "先固定两名低失误角色，练熟转点、救援节奏和基本 BP，再逐步引入地图与克制判断。频繁换角会让问题更难定位。", "一至四阶榜单与版本指南"];
  result.innerHTML = `<strong>${level[0]} · ${score}/30</strong><p>${level[1]}</p><p>建议优先查看：${level[2]}</p><a href="index.html#rankings">进入分段榜单</a>`;
  result.classList.add("is-visible");
  result.scrollIntoView({ behavior: "smooth", block: "center" });
});
