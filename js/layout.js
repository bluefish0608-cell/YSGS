function getRootPrefix() {
  const path = window.location?.pathname || "";
  return path.includes("/pages/") ? "../" : "";
}

function isExternalPath(path) {
  return !path || path.startsWith("#") || path.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(path);
}

function resolvePath(path) {
  if (isExternalPath(path) || path.startsWith("../")) return path;
  return `${getRootPrefix()}${path}`;
}

function renderHeader() {
  const header = document.getElementById("siteHeader");
  if (!header || typeof navigationData === "undefined" || typeof siteData === "undefined") return;

  const currentPage = document.body.dataset.page;
  const menuMarkup = navigationData.map(item => {
    const classes = ["nav-item"];
    if (currentPage === item.page) classes.push("active");
    if (item.dividerAfter) classes.push("divider-after");

    const submenus = item.submenus?.length
      ? `<ul class="submenu">${item.submenus.map(sub => `<li><a href="${resolvePath(sub.href)}">${sub.label}</a></li>`).join("")}</ul>`
      : "";

    return `<li class="${classes.join(" ")}">
      <a class="nav-link" href="${resolvePath(item.href)}">${item.title}</a>
      ${submenus}
    </li>`;
  }).join("");

  header.innerHTML = `<div class="header-inner">
    <a class="brand" href="${resolvePath("index.html")}" aria-label="YSGS home">
      <span class="brand-mark" aria-hidden="true">
        <img src="${resolvePath(siteData.icon || "assets/images/ico.png")}" alt="">
      </span>
      <span class="brand-text">
        <strong>${siteData.name}</strong>
        <small>${siteData.fullName}</small>
      </span>
    </a>
    <button class="menu-toggle" id="menuToggle" type="button" aria-expanded="false" aria-controls="siteNav">
      <span></span><span></span><span></span>
      <span class="sr-only">메뉴 열기</span>
    </button>
    <nav class="site-nav" id="siteNav" aria-label="주요 메뉴">
      <ul>${menuMarkup}</ul>
    </nav>
  </div>`;
}

function renderFooter() {
  const footer = document.getElementById("siteFooter");
  if (!footer || typeof siteData === "undefined") return;

  footer.innerHTML = `<div class="container footer-grid">
    <div class="footer-content">
      <strong>${siteData.name}</strong>
      <p>${siteData.fullName}<br>${siteData.department}</p>
      <p class="copyright">© ${new Date().getFullYear()} YSGS. All Rights Reserved.</p>
    </div>
  </div>`;
}

function setupHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const sync = () => {
    const isInnerPage = document.body.dataset.page !== "home";
    header.classList.toggle("scrolled", isInnerPage || window.scrollY > 24);
  };
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}
