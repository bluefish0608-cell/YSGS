let currentNewsItems = [];
let currentPage = 1;
let postsPerPage = 20;
const pageSizeOptions = [5, 10, 20, 30];
const newsDayMs = 24 * 60 * 60 * 1000;

function getNewsCategories() {
  if (typeof newsData === "undefined") return [];
  return [...new Set(newsData.map(item => item.category).filter(Boolean))];
}

function parseNewsDateParts(dateString) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString || "");
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);
  const isValid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;

  return isValid ? { year, month, day } : null;
}

function getLocalTodayParts() {
  const today = new Date();
  return {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate()
  };
}

function datePartsToUtcTime(parts) {
  return Date.UTC(parts.year, parts.month - 1, parts.day);
}

function isNewPost(item) {
  const postDate = parseNewsDateParts(item.date);
  if (!postDate) return false;

  const diffDays = (datePartsToUtcTime(getLocalTodayParts()) - datePartsToUtcTime(postDate)) / newsDayMs;
  return diffDays >= 0 && diffDays < 5;
}

function renderNewBadge(item) {
  return isNewPost(item) ? `<span class="new-badge">NEW!</span>` : "";
}

function getNewsNoLabel(item) {
  return item.pinned ? "공지" : `No. ${item.id}`;
}

function getNewsAuthor(item) {
  return item.author || "YSGS 운영진";
}

function getAttachmentLabel(attachment) {
  const meta = [attachment.type, attachment.size].filter(Boolean).join(" · ");
  return meta ? `${attachment.label} (${meta})` : attachment.label;
}

function renderNewsAttachment(attachment) {
  const isExternal = /^[a-z][a-z0-9+.-]*:/i.test(attachment.href);
  const href = resolvePath(attachment.href);
  const attrs = isExternal ? 'target="_blank" rel="noopener"' : "download";
  const action = isExternal ? "열기" : "다운로드";

  return `<a class="news-attachment-link" href="${href}" ${attrs}>
    <span>${getAttachmentLabel(attachment)}</span>
    <strong>${action}</strong>
  </a>`;
}

function getNewsContentBlocks(item) {
  if (Array.isArray(item.blocks) && item.blocks.length) return item.blocks;

  const blocks = [];
  if (item.image) {
    blocks.push({
      type: "images",
      images: [{
        src: item.image,
        alt: item.title,
        caption: ""
      }]
    });
  }

  (item.content || item.summary || "")
    .split("\n")
    .filter(Boolean)
    .forEach(text => blocks.push({ type: "paragraph", text }));

  return blocks;
}

function getNewsBlocksText(item) {
  return getNewsContentBlocks(item).map(block => {
    if (block.type === "paragraph") return block.text || "";
    if (block.type === "images") {
      return (block.images || []).map(image => `${image.alt || ""} ${image.caption || ""}`).join(" ");
    }
    return "";
  }).join(" ");
}

function renderNewsContentImages(block, item) {
  const images = (block.images || []).filter(image => image && image.src);
  if (!images.length) return "";

  if (images.length === 1) {
    const image = images[0];
    return `<figure class="news-content-media news-content-media-single">
      <img src="${resolvePath(image.src)}" alt="${image.alt || item.title}" loading="lazy" decoding="async">
      ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ""}
    </figure>`;
  }

  return `<div class="news-content-media news-content-media-grid" aria-label="${item.title} 관련 이미지">
    <div class="news-content-image-grid">
      ${images.map(image => `<figure class="news-content-image-card">
        <img src="${resolvePath(image.src)}" alt="${image.alt || item.title}" loading="lazy" decoding="async">
        ${image.caption ? `<figcaption>${image.caption}</figcaption>` : ""}
      </figure>`).join("")}
    </div>
  </div>`;
}

function renderNewsContentBlock(block, item) {
  if (block.type === "paragraph" && block.text) return `<p>${block.text}</p>`;
  if (block.type === "images") return renderNewsContentImages(block, item);
  return "";
}

function renderNewsModalBody(item) {
  return getNewsContentBlocks(item).map(block => renderNewsContentBlock(block, item)).join("");
}

function renderNewsRows(items) {
  if (!items.length) {
    return `<tr><td class="news-empty" colspan="5">조건에 맞는 소식이 없습니다.</td></tr>`;
  }

  return items.map(item => `<tr class="news-board-row" data-news-id="${item.id}" tabindex="0">
    <td>${item.pinned ? `<span class="notice-badge">공지</span>` : item.id}</td>
    <td>${item.category}</td>
    <td class="news-author-cell">${getNewsAuthor(item)}</td>
    <td>
      <button class="news-title-button" type="button" data-news-id="${item.id}">
        <span class="news-title-text">${item.title}</span>
        ${renderNewBadge(item)}
        ${item.attachments?.length ? `<small title="첨부파일 있음">첨부</small>` : ""}
      </button>
    </td>
    <td><time>${item.date}</time></td>
  </tr>`).join("");
}

function getNewsTotalPages() {
  if (!currentNewsItems.length) return 1;
  return Math.max(1, Math.ceil(currentNewsItems.length / postsPerPage));
}

function clampNewsPage(page) {
  const totalPages = getNewsTotalPages();
  return Math.min(Math.max(Number(page) || 1, 1), totalPages);
}

function getCurrentPageNewsItems() {
  const start = (currentPage - 1) * postsPerPage;
  return currentNewsItems.slice(start, start + postsPerPage);
}

function renderNewsPageSizeControl() {
  return `<label class="news-page-size-control" for="newsPageSize">
    <span>페이지당</span>
    <select id="newsPageSize" aria-label="페이지당 게시글 수">
      ${pageSizeOptions.map(size => `<option value="${size}" ${size === postsPerPage ? "selected" : ""}>${size}개</option>`).join("")}
    </select>
  </label>`;
}

function getNewsPaginationItems(totalPages) {
  const maxVisiblePages = 5;
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, index) => ({ type: "page", page: index + 1 }));
  }

  const halfWindow = Math.floor(maxVisiblePages / 2);
  let start = Math.max(1, currentPage - halfWindow);
  let end = start + maxVisiblePages - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  const pages = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  const items = [];

  if (pages[0] > 1) {
    items.push({ type: "page", page: 1 });
    if (pages[0] > 2) items.push({ type: "ellipsis" });
  }

  pages.forEach(page => items.push({ type: "page", page }));

  if (pages[pages.length - 1] < totalPages) {
    if (pages[pages.length - 1] < totalPages - 1) items.push({ type: "ellipsis" });
    items.push({ type: "page", page: totalPages });
  }

  return items;
}

function renderNewsPageButton(label, page, options = {}) {
  const disabled = options.disabled ? "disabled" : "";
  const active = options.active ? " active" : "";
  const ariaCurrent = options.active ? 'aria-current="page"' : "";

  return `<button class="news-page-button${active}" type="button" data-news-page="${page}" ${disabled} ${ariaCurrent}>${label}</button>`;
}

function renderNewsPagination() {
  const totalPages = getNewsTotalPages();
  if (totalPages <= 1) return "";

  const pageButtons = getNewsPaginationItems(totalPages)
    .map(item => {
      if (item.type === "ellipsis") return `<span class="news-page-ellipsis" aria-hidden="true">…</span>`;
      return renderNewsPageButton(item.page, item.page, { active: item.page === currentPage });
    })
    .join("");

  return `<nav class="news-pagination" aria-label="소식 게시판 페이지 이동">
    <p class="news-pagination-status">총 ${totalPages}페이지 중 ${currentPage}페이지</p>
    ${renderNewsPageButton("처음", 1, { disabled: currentPage === 1 })}
    ${renderNewsPageButton("이전", currentPage - 1, { disabled: currentPage === 1 })}
    <div class="news-page-numbers">${pageButtons}</div>
    ${renderNewsPageButton("다음", currentPage + 1, { disabled: currentPage === totalPages })}
    ${renderNewsPageButton("마지막", totalPages, { disabled: currentPage === totalPages })}
  </nav>`;
}

function renderNewsBoard() {
  currentPage = clampNewsPage(currentPage);

  const body = document.getElementById("newsBoardBody");
  const count = document.getElementById("newsResultCount");
  const pagination = document.getElementById("newsPagination");
  const pageSizeSlot = document.getElementById("newsPageSizeSlot");

  if (body) body.innerHTML = renderNewsRows(getCurrentPageNewsItems());
  if (count) count.textContent = `${currentNewsItems.length}건`;
  if (pagination) pagination.innerHTML = renderNewsPagination();
  if (pageSizeSlot) pageSizeSlot.innerHTML = renderNewsPageSizeControl();

  setupNewsRowActions();
  setupNewsPaginationActions();
  setupNewsPageSizeControl();
}

function filterNewsItems() {
  const category = document.getElementById("newsCategoryFilter")?.value || "all";
  const target = document.getElementById("newsSearchTarget")?.value || "title";
  const keyword = (document.getElementById("newsSearchInput")?.value || "").trim().toLowerCase();

  currentNewsItems = newsData.filter(item => {
    const categoryMatches = category === "all" || item.category === category;
    if (!categoryMatches) return false;
    if (!keyword) return true;

    const haystacks = {
      title: item.title,
      content: `${item.summary || ""} ${item.content || ""} ${getNewsBlocksText(item)}`,
      all: `${item.title || ""} ${item.category || ""} ${getNewsAuthor(item)} ${item.summary || ""} ${item.content || ""} ${getNewsBlocksText(item)}`
    };

    return (haystacks[target] || haystacks.title || "").toLowerCase().includes(keyword);
  });

  currentPage = 1;
  renderNewsBoard();
}

function renderNewsModalNavCard(item, direction) {
  const directionLabel = direction === "prev" ? "이전 게시글" : "다음 게시글";

  if (!item) {
    return `<button class="news-modal-nav-card disabled" type="button" disabled>
      <span class="news-modal-nav-label">${directionLabel}</span>
      <strong>${directionLabel}이 없습니다</strong>
    </button>`;
  }

  return `<button class="news-modal-nav-card" type="button" data-news-nav-id="${item.id}">
    <span class="news-modal-nav-label">${directionLabel}</span>
    <span class="news-modal-nav-meta">
      <span>${getNewsNoLabel(item)}</span>
      <span>${item.category}</span>
      <time>${item.date}</time>
    </span>
    <strong>${item.title}</strong>
  </button>`;
}

function renderNewsModalNavigation(previousItem, nextItem) {
  return `<nav class="news-modal-nav" aria-label="게시글 이동">
    ${renderNewsModalNavCard(previousItem, "prev")}
    ${renderNewsModalNavCard(nextItem, "next")}
  </nav>`;
}

function setupNewsModalNavigation() {
  document.querySelectorAll("[data-news-nav-id]").forEach(button => {
    button.addEventListener("click", () => openNewsDetail(button.dataset.newsNavId));
  });
}

function openNewsDetail(id) {
  let list = currentNewsItems.length ? currentNewsItems : newsData;
  let currentIndex = list.findIndex(news => String(news.id) === String(id));

  if (currentIndex < 0) {
    list = newsData;
    currentIndex = list.findIndex(news => String(news.id) === String(id));
  }

  const item = list[currentIndex];
  const modal = document.getElementById("newsDetailModal");
  const content = document.getElementById("newsModalContent");
  if (!item || !modal || !content) return;

  const attachments = item.attachments || [];
  const previousItem = currentIndex > 0 ? list[currentIndex - 1] : null;
  const nextItem = currentIndex < list.length - 1 ? list[currentIndex + 1] : null;

  content.innerHTML = `<header class="news-modal-header">
    <div>
      <p class="panel-kicker">${item.category}</p>
      <h2 id="newsModalTitle"><span>${item.title}</span>${renderNewBadge(item)}</h2>
      <div class="news-modal-meta">
        <span>${getNewsNoLabel(item)}</span>
        <span>${getNewsAuthor(item)}</span>
        <time>${item.date}</time>
      </div>
    </div>
  </header>
  <div class="news-modal-body">${renderNewsModalBody(item)}</div>
  ${attachments.length ? `<section class="news-attachment-box" aria-label="첨부파일">
    <h3>첨부파일</h3>
    <div>${attachments.map(renderNewsAttachment).join("")}</div>
  </section>` : ""}
  ${renderNewsModalNavigation(previousItem, nextItem)}`;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  setupNewsModalNavigation();
}

function closeNewsDetail() {
  const modal = document.getElementById("newsDetailModal");
  const content = document.getElementById("newsModalContent");
  if (!modal || !content) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  content.innerHTML = "";
}

function setupNewsRowActions() {
  document.querySelectorAll("[data-news-id]").forEach(element => {
    if (element.dataset.newsReady) return;
    element.addEventListener("click", event => {
      event.stopPropagation();
      openNewsDetail(element.dataset.newsId);
    });
    element.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openNewsDetail(element.dataset.newsId);
      }
    });
    element.dataset.newsReady = "true";
  });
}

function setupNewsPaginationActions() {
  document.querySelectorAll("[data-news-page]").forEach(button => {
    button.addEventListener("click", () => {
      currentPage = clampNewsPage(button.dataset.newsPage);
      renderNewsBoard();
      document.getElementById("news-board")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function setupNewsPageSizeControl() {
  const select = document.getElementById("newsPageSize");
  if (!select) return;

  select.addEventListener("change", () => {
    postsPerPage = Number(select.value) || 20;
    currentPage = 1;
    renderNewsBoard();
  });
}

function setupNewsFilters() {
  document.getElementById("newsSearchButton")?.addEventListener("click", filterNewsItems);
  document.getElementById("newsResetButton")?.addEventListener("click", () => {
    document.getElementById("newsCategoryFilter").value = "all";
    document.getElementById("newsSearchTarget").value = "title";
    document.getElementById("newsSearchInput").value = "";
    filterNewsItems();
  });
  document.getElementById("newsSearchInput")?.addEventListener("keydown", event => {
    if (event.key === "Enter") filterNewsItems();
  });
  document.getElementById("newsCategoryFilter")?.addEventListener("change", filterNewsItems);
  document.getElementById("newsSearchTarget")?.addEventListener("change", filterNewsItems);
}

function setupNewsModal() {
  document.querySelectorAll("[data-news-modal-close]").forEach(button => {
    button.addEventListener("click", closeNewsDetail);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeNewsDetail();
  });
}

function openNewsDetailFromUrl() {
  const postId = new URLSearchParams(window.location.search).get("post");
  if (!postId) return;

  const hasPost = newsData.some(item => String(item.id) === String(postId));
  if (!hasPost) return;

  requestAnimationFrame(() => openNewsDetail(postId));
}

function renderNewsPage() {
  const root = document.getElementById("newsPageRoot");
  if (!root || typeof newsData === "undefined") return;

  const categories = getNewsCategories();
  root.innerHTML = `<header class="page-hero">
    <p class="eyebrow">YSGS News</p>
    <h1>소식</h1>
    <p>YSGS의 공지, 최근 활동, 세미나와 답사 기록을 한곳에서 확인할 수 있습니다.</p>
  </header>

  <section class="news-board-panel" id="news-board">
    <form class="news-filter-bar" id="newsFilterForm" action="javascript:void(0)">
      <select id="newsCategoryFilter" aria-label="분류 선택">
        <option value="all">::분류선택::</option>
        ${categories.map(category => `<option value="${category}">${category}</option>`).join("")}
      </select>
      <select id="newsSearchTarget" aria-label="검색 대상">
        <option value="title">제목</option>
        <option value="content">내용</option>
        <option value="all">전체</option>
      </select>
      <input id="newsSearchInput" type="search" placeholder="검색어를 입력하세요" aria-label="검색어" />
      <button class="news-search-button" id="newsSearchButton" type="button">검색</button>
      <button class="news-reset-button" id="newsResetButton" type="button">초기화</button>
    </form>

    <div class="news-board-meta">
      <div>
        <strong>전체 게시글</strong>
        <span id="newsResultCount">${newsData.length}건</span>
      </div>
      <div id="newsPageSizeSlot"></div>
    </div>

    <div class="news-table-wrap">
      <table class="news-board-table">
        <thead>
          <tr>
            <th scope="col">No.</th>
            <th scope="col">분류</th>
            <th scope="col">작성자</th>
            <th scope="col">제목</th>
            <th scope="col">날짜</th>
          </tr>
        </thead>
        <tbody id="newsBoardBody"></tbody>
      </table>
    </div>
    <div id="newsPagination"></div>
  </section>`;

  currentNewsItems = [...newsData];
  currentPage = 1;
  postsPerPage = 20;
  renderNewsBoard();
  setupNewsFilters();
  setupNewsModal();
  openNewsDetailFromUrl();
}
