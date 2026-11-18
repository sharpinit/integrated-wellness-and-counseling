/* Integrated Wellness & Counseling — shared script (all pages, deferred).
   Everything here is progressive enhancement: without JS the menu and the
   "Who we help" links are simply visible, and forms show native validation. */
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

  /* ---------- Pre-select the request type from the link that brought you ----------
     "Book a NeuralChek" links to get-started.html#book-neuralchek and
     "Request a Private Consultation" to #request-consultation. Those ids sit
     on the matching radio buttons. */
  const preselect = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    const choice = id && document.getElementById(id);
    if (choice && choice.type === "radio") {
      choice.checked = true;
      document.getElementById("request")?.scrollIntoView();
    }
  };
  preselect();
  window.addEventListener("hashchange", preselect);

  /* ---------- Forms ----------
     VISUAL MOCKUP ONLY. Nothing is sent anywhere. Before launch, connect each
     form to a HIPAA-compliant form service (the referral form collects client
     names and phone numbers) and remove the demo confirmation below. */
  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    const status = form.querySelector(".form__status");

    const showError = (field, show) => {
      const target = field.type === "radio" || field.type === "checkbox"
        ? field.closest(".choices") || field
        : field;
      const error = document.getElementById(target.dataset.error || "");
      if (field.type !== "radio") field.setAttribute("aria-invalid", String(show));
      if (error) error.hidden = !show;
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let firstInvalid = null;
      form.querySelectorAll("[required]").forEach((field) => {
        const valid = field.checkValidity();
        showError(field, !valid);
        if (!valid && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }
      form.reset();
      if (status) {
        status.hidden = false;
        status.focus();
      }
    });

    // Clear a field's error as soon as it is fixed
    form.addEventListener("input", (event) => {
      const field = event.target;
      if (field.required && field.checkValidity()) showError(field, false);
    });
    form.addEventListener("change", (event) => {
      const field = event.target;
      if (field.required && field.checkValidity()) showError(field, false);
    });
  });
})();
