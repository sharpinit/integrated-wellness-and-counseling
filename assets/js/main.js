/* Mobile menu — progressive enhancement.
   Without JS the nav is simply visible. With JS, the toggle appears and the
   menu collapses below the desktop breakpoint. */
(() => {
  const header = document.querySelector(".site-header");
  const toggle = header?.querySelector(".menu-toggle");
  if (!header || !toggle) return;

  const desktop = window.matchMedia("(min-width: 80em)");

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    header.dataset.menu = open ? "open" : "closed";
  };

  toggle.hidden = false;
  setOpen(false);

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Escape closes the menu and returns focus to the toggle
  header.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });

  // Reset when crossing to desktop so the menu never gets stuck open
  desktop.addEventListener("change", () => setOpen(false));
})();
