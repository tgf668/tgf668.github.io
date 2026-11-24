(() => {
  const popup = document.querySelector(".site-search .popup");
  const trigger = document.getElementById("nav-search-btn");
  const mask = document.getElementById("mask");
  const input = popup.querySelector("#search-text");
  const results = popup.querySelector("#reimu-hits");
  const status = popup.querySelector("#reimu-stats");
  const pagination = popup.querySelector("#reimu-pagination");
  const pageSize = 10;
  let entries;
  let request;
  let matches = [];

  function showPage(page) {
    results.replaceChildren();
    pagination.replaceChildren();
    const start = (page - 1) * pageSize;
    for (const hit of matches.slice(start, start + pageSize)) {
      const link = document.createElement("a");
      link.className = "reimu-hit-item-link";
      link.href = hit.url;
      link.textContent = hit.title;
      results.append(link);
    }
    const pages = Math.ceil(matches.length / pageSize);
    if (pages > 1) {
      for (let n = 1; n <= pages; n++) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "page-number";
        button.textContent = n;
        button.setAttribute("aria-label", "第 " + n + " 页");
        if (n === page) button.setAttribute("aria-current", "page");
        button.addEventListener("click", () => {
          showPage(n);
          pagination.querySelector('[aria-current="page"]').focus();
        });
        pagination.append(button);
      }
    }
    popup.querySelector(".reimu-results").scrollTop = 0;
  }

  function search() {
    if (!entries) return;
    const query = input.value.trim().toLowerCase();
    matches = query ? entries.filter((entry) => entry.text.includes(query)) : [];
    matches.sort((a, b) =>
      Number(b.title.toLowerCase().includes(query)) - Number(a.title.toLowerCase().includes(query))
    );
    status.textContent = query
      ? (matches.length ? "找到 " + matches.length + " 条结果" : "没有找到相关内容")
      : "";
    showPage(1);
  }

  async function openSearch() {
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.getElementById("container").style.marginRight = gap + "px";
    document.getElementById("header-nav").style.marginRight = gap + "px";
    popup.classList.add("show");
    mask.classList.remove("hide");
    document.body.style.overflow = "hidden";
    input.focus();
    if (entries) return;
    status.textContent = "正在读取搜索索引…";
    try {
      request ??= fetch(popup.dataset.index).then(async (response) => {
        if (!response.ok) throw new Error("Search index unavailable");
        return (await response.json()).map(({ title, url, content }) => ({
          title: title || url, url, text: [title, content].join("\n").toLowerCase()
        }));
      });
      entries = await request;
      search();
    } catch {
      request = null;
      status.textContent = "索引暂时无法读取，请关闭后重试。";
    }
  }

  function closeSearch() {
    if (!popup.classList.contains("show")) return;
    popup.classList.remove("show");
    mask.classList.add("hide");
    document.getElementById("container").style.marginRight = "";
    document.getElementById("header-nav").style.marginRight = "";
    document.body.style.overflow = "";
    trigger.focus();
  }

  trigger.addEventListener("click", openSearch);
  input.addEventListener("input", search);
  popup.querySelector(".popup-btn-close").addEventListener("click", closeSearch);
  document.addEventListener("click", (event) => {
    if (event.target === mask) closeSearch();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSearch();
  });
  window.addEventListener("pjax:send", closeSearch);
  window.addEventListener("pagehide", closeSearch);
})();
