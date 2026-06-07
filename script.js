const body = document.body;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const promo = document.querySelector("[data-promo]");
const promoCloseButtons = document.querySelectorAll("[data-promo-close]");
const promoSessionKey = "radikalCampaignPopupClosed";

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

window.addEventListener("load", () => {
  body.classList.add("loaded");
  showPromoAfterLoader();
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  header.classList.toggle("is-open", isOpen);
  body.classList.toggle("nav-open", isOpen);
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    header.classList.remove("is-open");
    body.classList.remove("nav-open");
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  observer.observe(item);
});

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const src = item.dataset.full;
    const caption = item.dataset.caption || "";
    lightboxImage.src = src;
    lightboxImage.alt = caption;
    lightboxCaption.textContent = caption;
    lightbox.hidden = false;
    body.style.overflow = "hidden";
  });
});

const hasClosedPromo = () => {
  try {
    return sessionStorage.getItem(promoSessionKey) === "true";
  } catch {
    return false;
  }
};

const rememberPromoClose = () => {
  try {
    sessionStorage.setItem(promoSessionKey, "true");
  } catch {
    // Browsers can block storage in strict privacy modes; closing should still work.
  }
};

const showPromoAfterLoader = () => {
  if (!promo || hasClosedPromo()) {
    return;
  }

  window.setTimeout(() => {
    promo.hidden = false;
    body.style.overflow = "hidden";
    window.requestAnimationFrame(() => {
      promo.classList.add("is-visible");
    });
  }, 780);
};

const closePromo = () => {
  if (!promo || promo.hidden) {
    return;
  }

  promo.classList.remove("is-visible");
  rememberPromoClose();
  window.setTimeout(() => {
    promo.hidden = true;
    body.style.overflow = "";
  }, 260);
};

promoCloseButtons.forEach((button) => {
  button.addEventListener("click", closePromo);
});

const closeLightbox = () => {
  lightbox.hidden = true;
  lightboxImage.src = "";
  body.style.overflow = "";
};

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && promo && !promo.hidden) {
    closePromo();
    return;
  }

  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});
