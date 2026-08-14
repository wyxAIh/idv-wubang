(() => {
  const params = new URLSearchParams(window.location.search);
  const archive = params.get("archive");
  const season = params.get("season");
  const isS43 = archive === "s43" || season === "43";

  window.IDV_SELECTED_ARCHIVE = isS43 ? "s43" : "latest";
  const assetVersion = "20260806-season-detail-fix";

  const isDetailPage = Boolean(document.querySelector("#detailShell"));
  const scripts = [
    isS43 ? "data/characters-s43-20260615.js" : "data/characters.js",
    "data/avatars.js",
    isDetailPage ? "data/detail-guides.js" : null,
    "app.js"
  ].filter(Boolean);

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `${src}?v=${assetVersion}`;
      script.defer = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  }

  scripts
    .reduce((chain, src) => chain.then(() => loadScript(src)), Promise.resolve())
    .catch((error) => {
      console.error(error);
      document.body.insertAdjacentHTML(
        "beforeend",
        `<div style="position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;padding:14px 16px;border:1px solid #d5ad62;border-radius:14px;background:#1b1410;color:#f4ddb0;box-shadow:0 18px 48px rgba(0,0,0,.35)">数据脚本加载失败：${error.message}</div>`
      );
    });

})();
