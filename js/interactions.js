function setupMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function copyTextWithFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();

  return copied ? Promise.resolve() : Promise.reject(new Error("Clipboard fallback failed"));
}

function setupCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", async () => {
      const original = button.textContent;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          try {
            await navigator.clipboard.writeText(button.dataset.copy);
          } catch (error) {
            await copyTextWithFallback(button.dataset.copy);
          }
        } else {
          await copyTextWithFallback(button.dataset.copy);
        }
        button.textContent = "복사 완료";
      } catch (error) {
        button.textContent = "복사 실패";
      }
      setTimeout(() => {
        button.textContent = original;
      }, 1600);
    });
  });
}

function setupImageModal() {
  const imageButtons = document.querySelectorAll("[data-image-src]");
  if (!imageButtons.length) return;

  let modal = document.getElementById("imageModal");
  if (!modal) {
    document.body.insertAdjacentHTML("beforeend", `<div class="image-modal" id="imageModal" aria-hidden="true">
      <div class="image-modal-backdrop" data-modal-close></div>
      <figure class="image-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="imageModalCaption">
        <button class="modal-close" type="button" data-modal-close aria-label="이미지 닫기">×</button>
        <img id="imageModalImage" alt="" />
        <figcaption id="imageModalCaption"></figcaption>
      </figure>
    </div>`);
    modal = document.getElementById("imageModal");
  }

  const modalImage = document.getElementById("imageModalImage");
  const caption = document.getElementById("imageModalCaption");
  if (!modalImage || !caption) return;

  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImage.removeAttribute("src");
  };

  imageButtons.forEach(button => {
    button.addEventListener("click", () => {
      modalImage.src = button.dataset.imageSrc;
      modalImage.alt = button.dataset.imageCaption || "";
      caption.textContent = button.dataset.imageCaption || "";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
    });
  });

  modal.querySelectorAll("[data-modal-close]").forEach(close => {
    close.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
}

function setupDisabledLinks() {
  document.querySelectorAll(".button-disabled").forEach(link => {
    link.addEventListener("click", event => event.preventDefault());
  });
}

function setupInteractions() {
  setupHeaderScroll();
  setupMobileMenu();
  setupCopyButtons();
  setupImageModal();
  setupDisabledLinks();
}
