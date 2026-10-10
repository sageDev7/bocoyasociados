(function () {
  "use strict";
  var body = document.body;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header al scrollear ---------- */
  function onScroll() { body.classList.toggle("scrolled", window.scrollY > 60); updateFloats(); }

  /* ---------- menú mobile ---------- */
  var burger = document.getElementById("burger");
  function closeMenu() { body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); }
  burger.addEventListener("click", function () {
    var open = !body.classList.contains("menu-open");
    body.classList.toggle("menu-open", open); burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  document.getElementById("moverlay").addEventListener("click", closeMenu);
  document.querySelectorAll("#mnav a").forEach(function (a) { a.addEventListener("click", closeMenu); });


  /* ---------- áreas: franjas que se expanden (solo desktop) ---------- */
  var strips = Array.prototype.slice.call(document.querySelectorAll(".strip"));
  var mqDesk = window.matchMedia("(min-width:1025px)");
  function activate(s) {
    if (!mqDesk.matches) return;
    strips.forEach(function (x) { x.classList.toggle("active", x === s); });
  }
  strips.forEach(function (s) {
    s.addEventListener("mouseenter", function () { activate(s); });
    s.addEventListener("focus", function () { activate(s); });
    s.addEventListener("click", function () { activate(s); });
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    item.querySelector(".faq-q").addEventListener("click", function () {
      var open = !item.classList.contains("open");
      document.querySelectorAll(".faq-item").forEach(function (x) {
        x.classList.remove("open"); x.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (open) { item.classList.add("open"); this.setAttribute("aria-expanded", "true"); }
    });
  });

  /* ---------- reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal,.reveal-left,.reveal-right");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- flotantes: se ocultan al llegar al footer ---------- */
  var waFloat = document.getElementById("waFloat"), backToTop = document.getElementById("backToTop");
  var footerVisible = false;
  function updateFloats() {
    var show = window.scrollY > 500 && !footerVisible;
    waFloat.classList.toggle("show", show); backToTop.classList.toggle("show", show);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { footerVisible = en.isIntersecting; }); updateFloats();
    }, { threshold: 0 }).observe(document.querySelector("footer.site"));
  }
  backToTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });

  /* ---------- áreas: índice lateral que marca la sección visible ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".area-nav a"));
  if (navLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) { var t = document.querySelector(a.getAttribute("href")); if (t) spy.observe(t); });
  }

  /* ---------- formulario (FormSubmit + modal), solo en el inicio ---------- */
  var form = document.getElementById("contactForm"), btn = document.getElementById("formSubmitBtn");
  var iframe = document.getElementById("formsubmit-iframe"), modal = document.getElementById("okModal"), sending = false;
  if (form) {
  function validField(input) {
    var v = input.value.trim();
    var ok = v !== "" && (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    input.closest(".field").classList.toggle("err", !ok); return ok;
  }
  form.addEventListener("submit", function (e) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (i) { if (!validField(i)) ok = false; });
    if (!ok) { e.preventDefault(); var f = form.querySelector(".field.err input,.field.err textarea"); if (f) f.focus(); return; }
    sending = true; btn.disabled = true; btn.textContent = "Enviando...";
  });
  form.querySelectorAll("[required]").forEach(function (i) {
    i.addEventListener("input", function () { if (i.closest(".field").classList.contains("err")) validField(i); });
  });
  iframe.addEventListener("load", function () {
    if (!sending) return;
    sending = false; form.reset(); btn.disabled = false; btn.textContent = "Enviar consulta";
    modal.classList.add("show");
  });
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.hasAttribute("data-close")) closeModal(); });
  }
  function closeModal() { if (modal) modal.classList.remove("show"); }
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenu(); closeModal(); } });

  document.getElementById("year").textContent = new Date().getFullYear();
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
