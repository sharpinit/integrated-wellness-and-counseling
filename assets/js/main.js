/* Integrated Wellness & Counseling — shared script (all pages, deferred).
   Everything here is progressive enhancement: without JS the menu and the
   "Who we help" links are simply visible. */
(() => {
  const header = document.querySelector(".site-header");
  const toggle = header?.querySelector(".menu-toggle");
  // Keep in step with the full-nav breakpoint in styles.css
  const desktop = window.matchMedia("(min-width: 84em)");

  /* ---------- Mobile menu ---------- */
  if (header && toggle) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      header.dataset.menu = open ? "open" : "closed";
    };
    toggle.hidden = false;
    setOpen(false);
    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    header.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    desktop.addEventListener("change", () => setOpen(false));
  }

  /* ---------- "Who we help" dropdown (disclosure pattern) ---------- */
  document.querySelectorAll(".nav-group").forEach((group) => {
    const button = group.querySelector(".nav-group__toggle");
    const list = group.querySelector(".nav-group__list");
    if (!button || !list) return;
    const isOpen = () => button.getAttribute("aria-expanded") === "true";
    const setOpen = (open) => {
      button.setAttribute("aria-expanded", String(open));
      list.hidden = !open;
    };
    setOpen(false);
    button.addEventListener("click", () => setOpen(!isOpen()));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen()) {
        event.stopPropagation(); // close the dropdown only, not the whole menu
        setOpen(false);
        button.focus();
      }
    });
    // On desktop the panel floats, so close it when focus or a click leaves it
    group.addEventListener("focusout", (event) => {
      if (desktop.matches && !group.contains(event.relatedTarget)) setOpen(false);
    });
    document.addEventListener("click", (event) => {
      if (desktop.matches && !group.contains(event.target)) setOpen(false);
    });
    desktop.addEventListener("change", () => setOpen(false));
  });

})();
