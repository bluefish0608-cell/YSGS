function setupHomeAnimations() {
  if (document.body.dataset.page !== "home") return;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const setDelay = (element, delay) => {
    element.style.setProperty("--reveal-delay", `${delay}ms`);
  };
  const prepareReveal = (element, delay = 0) => {
    if (!element) return null;
    element.classList.add("home-reveal");
    setDelay(element, delay);
    return element;
  };
  const showElement = element => {
    if (element) element.classList.add("is-visible");
  };
  const wait = duration => new Promise(resolve => setTimeout(resolve, duration));
  const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));
  const getBackgroundImageUrl = element => {
    if (!element) return "";
    const backgroundImage = element.style.backgroundImage || getComputedStyle(element).backgroundImage;
    const match = backgroundImage.match(/^url\(["']?(.*?)["']?\)$/);
    return match ? match[1] : "";
  };
  const preloadImage = url => new Promise(resolve => {
    if (!url) {
      resolve();
      return;
    }

    const image = new Image();
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    image.addEventListener("load", finish, { once: true });
    image.addEventListener("error", finish, { once: true });
    image.src = url;
    if (image.complete) finish();
  });
  const showHeroElements = elements => {
    if (!elements.length) return;

    document.body.classList.add("home-animation-ready");
    const heroMedia = document.querySelector(".hero-media");

    Promise.race([preloadImage(getBackgroundImageUrl(heroMedia)), wait(1200)])
      .then(() => wait(160))
      .then(nextFrame)
      .then(nextFrame)
      .then(() => {
        elements.forEach(element => {
          element.getBoundingClientRect();
        });
        elements.forEach(showElement);
        document.body.classList.add("home-animation-started");
      });
  };

  const heroItems = [
    { selector: ".hero-media", delay: 0, extraClass: "home-hero-media-animate" },
    { selector: ".hero-shade", delay: 80, extraClass: "home-hero-shade-animate" },
    { selector: ".hero-copy .eyebrow", delay: 180 },
    { selector: ".hero-copy h1", delay: 280 },
    { selector: ".hero-description", delay: 400 },
    { selector: ".hero-actions", delay: 520 },
    { selector: ".hero-brief", delay: 640 }
  ];

  const heroElements = heroItems
    .map(item => {
      const element = document.querySelector(item.selector);
      if (!element) return null;
      element.classList.add("home-hero-animate");
      if (item.extraClass) element.classList.add(item.extraClass);
      setDelay(element, item.delay);
      return element;
    })
    .filter(Boolean);

  const sectionHeadings = Array.from(document.querySelectorAll(".section-heading"))
    .map(element => prepareReveal(element, 0))
    .filter(Boolean);
  const activityGrid = document.querySelector(".activity-feature-grid");
  const activityCards = Array.from(document.querySelectorAll(".activity-feature"))
    .map(element => prepareReveal(element, 0))
    .filter(Boolean);
  const featuredNewsGrid = document.querySelector(".featured-news-grid");
  const featuredNewsCards = Array.from(document.querySelectorAll(".featured-news-card"))
    .map(element => prepareReveal(element, 0))
    .filter(Boolean);
  const newsList = document.querySelector(".news-list");
  const newsRows = Array.from(document.querySelectorAll(".news-row"))
    .map((element, index) => prepareReveal(element, index * 110))
    .filter(Boolean);
  const joinBand = prepareReveal(document.querySelector(".join-band"), 0);
  const individualRevealElements = [...sectionHeadings, joinBand].filter(Boolean);
  const revealElements = [...individualRevealElements, ...activityCards, ...featuredNewsCards, ...newsRows];

  const allAnimatedElements = [...heroElements, ...revealElements];
  if (reduceMotion) {
    allAnimatedElements.forEach(showElement);
    return;
  }

  showHeroElements(heroElements);

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(showElement);
    return;
  }

  const observerOptions = {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
  };
  const observeOnce = (trigger, callback) => {
    if (!trigger) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        callback();
        observer.unobserve(entry.target);
      });
    }, observerOptions);
    observer.observe(trigger);
  };

  individualRevealElements.forEach(element => {
    observeOnce(element, () => showElement(element));
  });
  observeOnce(activityGrid, () => {
    activityCards.forEach(showElement);
  });
  observeOnce(featuredNewsGrid, () => {
    featuredNewsCards.forEach(showElement);
  });
  observeOnce(newsList, () => {
    newsRows.forEach(showElement);
  });
}
