(() => {
  "use strict";

  const enhance = () => {
    document.querySelectorAll(".btn").forEach((button) => {
      button.classList.add("btn-press");
    });

    document.querySelectorAll(".card").forEach((card) => {
      card.classList.add("card-lift");
    });

    document.querySelectorAll("[data-tooltip]").forEach((target) => {
      target.setAttribute("aria-label", target.dataset.tooltip);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhance, { once: true });
  } else {
    enhance();
  }
})();
