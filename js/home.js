function renderHomeHero() {
  if (typeof siteData === "undefined" || typeof indexData === "undefined") return;

  const hero = indexData.hero;
  const media = document.getElementById("homeHeroMedia");
  const eyebrow = document.getElementById("homeHeroEyebrow");
  const title = document.getElementById("homeHeroTitle");
  const description = document.getElementById("homeHeroDescription");
  const actions = document.getElementById("homeHeroActions");
  const brief = document.getElementById("homeHeroBrief");

  if (media) media.style.backgroundImage = `url("${hero.image}")`;
  if (eyebrow) eyebrow.textContent = hero.eyebrow;
  if (title) title.innerHTML = hero.title.split("\n").join("<br>");
  if (description) description.textContent = hero.description;
  if (actions) {
    actions.innerHTML = hero.actions.map(action => `<a class="button ${action.style === "secondary" ? "button-secondary" : "button-primary"}" href="${resolvePath(action.href)}">${action.label}</a>`).join("");
  }
  if (brief) {
    brief.innerHTML = `<p>${siteData.department}</p>
      <div class="hero-stat-grid">${hero.stats.map(stat => `<div><span>${stat.label}</span><strong>${stat.value}</strong></div>`).join("")}</div>`;
  }
}

function renderHomeActivities() {
  const root = document.getElementById("homeActivityHighlights");
  if (!root || typeof activitiesData === "undefined") return;

  const activityItems = getHomeActivityItems();

  if (!activityItems.length) {
    root.innerHTML = `<p class="home-activity-empty">홈에 표시할 활동이 없습니다.</p>`;
    setupHomeActivityCarousel();
    return;
  }

  root.innerHTML = activityItems.map(activity => `<article class="activity-feature">
    <img src="${resolvePath(activity.image)}" alt="${activity.title}" loading="lazy" decoding="async">
    <div>
      <p>${activity.label}</p>
      <h3>${activity.title}</h3>
      <span>${activity.summary}</span>
    </div>
  </article>`).join("");

  setupHomeActivityCarousel();
}

function getHomeActivityItems() {
  const config = typeof homeData !== "undefined" ? homeData.whatWeDo : null;
  const configuredItems = config && Array.isArray(config.items) ? config.items : null;

  if (!configuredItems) {
    return activitiesData.slice(0, 4);
  }

  return configuredItems
    .filter(item => item && item.visible !== false && item.activityId)
    .map(item => activitiesData.find(activity => String(activity.id) === String(item.activityId)))
    .filter(Boolean);
}

function setupHomeActivityCarousel() {
  const carousel = document.getElementById("homeActivityCarousel");
  const rail = document.getElementById("homeActivityHighlights");
  const prevButton = document.getElementById("homeActivityPrev");
  const nextButton = document.getElementById("homeActivityNext");
  if (!carousel || !rail || !prevButton || !nextButton) return;

  if (carousel.dataset.carouselReady === "true") {
    requestAnimationFrame(() => carousel.dispatchEvent(new Event("activity-carousel:update")));
    return;
  }

  const getMaxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
  const updateControls = () => {
    const maxScroll = getMaxScroll();
    const hasOverflow = maxScroll > 2;
    carousel.classList.toggle("has-overflow", hasOverflow);
    prevButton.disabled = !hasOverflow || rail.scrollLeft <= 2;
    nextButton.disabled = !hasOverflow || rail.scrollLeft >= maxScroll - 2;
  };
  const scrollByPage = direction => {
    const maxScroll = getMaxScroll();
    const cards = Array.from(rail.querySelectorAll(".activity-feature"));
    const firstCard = cards[0];
    const secondCard = cards[1];
    const cardGap = firstCard && secondCard ? secondCard.offsetLeft - firstCard.offsetLeft - firstCard.offsetWidth : 0;
    const cardStep = firstCard ? firstCard.offsetWidth + Math.max(0, cardGap) : rail.clientWidth;
    const visibleCount = firstCard ? Math.max(1, Math.round((rail.clientWidth + Math.max(0, cardGap)) / cardStep)) : 1;
    const pageDistance = Math.max(cardStep, visibleCount * cardStep);
    const target = direction > 0
      ? Math.min(maxScroll, rail.scrollLeft + pageDistance)
      : Math.max(0, rail.scrollLeft - pageDistance);

    rail.scrollTo({ left: target, behavior: "smooth" });
  };
  let ticking = false;
  const requestControlUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateControls();
      ticking = false;
    });
  };

  prevButton.addEventListener("click", () => scrollByPage(-1));
  nextButton.addEventListener("click", () => scrollByPage(1));
  rail.addEventListener("scroll", requestControlUpdate, { passive: true });
  rail.addEventListener("keydown", event => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    scrollByPage(event.key === "ArrowRight" ? 1 : -1);
  });
  window.addEventListener("resize", () => {
    rail.scrollTo({ left: Math.min(rail.scrollLeft, getMaxScroll()) });
    requestControlUpdate();
  });
  carousel.addEventListener("activity-carousel:update", updateControls);
  carousel.dataset.carouselReady = "true";

  updateControls();
}

function getHomeNewsConfig() {
  if (typeof homeNewsConfig !== "undefined") return homeNewsConfig;

  return {
    recentLimit: 3,
    featuredTitle: "주요 소식",
    featuredLead: "",
    featuredBackground: "",
    fallbackImage: "",
    featuredLimit: 4,
    featuredItems: [],
    featuredNewsIds: []
  };
}

function getNewsPostUrl(id) {
  return resolvePath(`pages/news.html?post=${encodeURIComponent(id)}`);
}

function getHomeNewsImage(item, fallbackImage) {
  if (item.image) return item.image;

  const imageBlock = (item.blocks || []).find(block => block.type === "images" && block.images?.length);
  const firstImage = imageBlock?.images?.find(image => image.src);
  return firstImage?.src || fallbackImage || "";
}

function getFeaturedNewsSettings(config) {
  return Array.isArray(config.featuredItems) && config.featuredItems.length
    ? config.featuredItems
    : (config.featuredNewsIds || []).map(id => ({ postId: id, image: "" }));
}

function getFeaturedNewsLimit(config, configuredItems) {
  return Math.max(1, Number(config.featuredLimit) || configuredItems.length || 4);
}

function getFeaturedNewsImage(featuredItem, newsItem, fallbackImage) {
  if (featuredItem.image) return featuredItem.image;
  return getHomeNewsImage(newsItem, fallbackImage);
}

function renderFeaturedNews() {
  const section = document.getElementById("homeFeaturedNewsSection");
  const title = document.getElementById("homeFeaturedNewsTitle");
  const lead = document.getElementById("homeFeaturedNewsLead");
  const root = document.getElementById("homeFeaturedNews");
  if (!section || !root || typeof newsData === "undefined") return;

  const config = getHomeNewsConfig();
  if (config.featuredBackground) {
    section.style.setProperty("--featured-news-bg", `url("${config.featuredBackground}")`);
  }
  if (title) title.textContent = config.featuredTitle || "주요 소식";
  if (lead) lead.textContent = config.featuredLead || "";

  const configuredItems = getFeaturedNewsSettings(config);
  const featuredLimit = getFeaturedNewsLimit(config, configuredItems);
  const featuredItems = configuredItems
    .map(featuredItem => {
      const newsItem = newsData.find(item => String(item.id) === String(featuredItem.postId));
      return newsItem ? { featuredItem, newsItem } : null;
    })
    .filter(Boolean)
    .slice(0, featuredLimit);

  if (!featuredItems.length) {
    section.hidden = true;
    return;
  }

  section.hidden = false;
  root.innerHTML = featuredItems.map(({ featuredItem, newsItem }) => {
    const image = getFeaturedNewsImage(featuredItem, newsItem, config.fallbackImage);
    return `<a class="featured-news-card" href="${getNewsPostUrl(newsItem.id)}" aria-label="${newsItem.title} 게시글 보기">
      ${image ? `<img src="${resolvePath(image)}" alt="${newsItem.title}" loading="lazy" decoding="async">` : ""}
      <span class="featured-news-card-shade" aria-hidden="true"></span>
      <span class="featured-news-card-content">
        <span class="featured-news-label">${newsItem.category}</span>
        <strong>${newsItem.title}</strong>
      </span>
    </a>`;
  }).join("");
}

function renderHomeNews() {
  const root = document.getElementById("homeNewsList");
  if (!root || typeof newsData === "undefined") return;

  const config = getHomeNewsConfig();
  const recentLimit = Math.max(1, Number(config.recentLimit) || 3);
  const recentItems = newsData
    .filter(item => item.showOnHomeRecent === true)
    .slice(0, recentLimit);

  if (!recentItems.length) {
    root.innerHTML = `<p class="home-news-empty">홈에 표시할 최근 소식이 없습니다.</p>`;
    return;
  }

  root.innerHTML = recentItems.map(item => `<a class="news-row" href="${getNewsPostUrl(item.id)}" aria-label="${item.title} 게시글 보기">
    <time>${item.date}</time>
    <h3>${item.title}</h3>
  </a>`).join("");
}

function getHomeJoinData() {
  if (typeof joinData !== "undefined") return joinData;

  return {
    title: "YSGS와 함께하세요",
    lead: "가입 안내 페이지에서 모집 상태와 절차를 확인할 수 있습니다."
  };
}

function renderHomeJoinBand() {
  const root = document.getElementById("homeJoinBand");
  if (!root || typeof contactData === "undefined") return;

  const join = getHomeJoinData();
  const joinUrl = contactData.joinFormUrl && contactData.joinFormUrl !== "#" ? contactData.joinFormUrl : resolvePath("pages/join.html");
  root.innerHTML = `<div>
    <p class="section-kicker">Join YSGS</p>
    <h2>${join.title}</h2>
    <p>${join.lead}</p>
  </div>
  <a class="button button-primary" href="${joinUrl}" ${contactData.joinFormUrl !== "#" ? 'target="_blank" rel="noopener"' : ""}>가입 안내 보기</a>`;
}

function renderHome() {
  renderHomeHero();
  renderHomeActivities();
  renderFeaturedNews();
  renderHomeNews();
  renderHomeJoinBand();
}
