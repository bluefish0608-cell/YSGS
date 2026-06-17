renderHeader();
renderFooter();
if (document.body.dataset.page === "home" && typeof renderHome === "function") renderHome();
if (document.body.dataset.page === "home" && typeof setupHomeAnimations === "function") setupHomeAnimations();
if (document.body.dataset.page === "news" && typeof renderNewsPage === "function") renderNewsPage();
if (typeof renderPage === "function") renderPage();
setupInteractions();
