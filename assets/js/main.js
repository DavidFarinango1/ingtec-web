/* ============================================================
   Ingtec — Lógica principal del sitio
   ============================================================ */

// --- Helpers ---
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const money = (n) => "$" + n.toLocaleString("es-EC");

function waLink(message) {
  const base = "https://wa.me/" + SITE.whatsapp;
  return base + "?text=" + encodeURIComponent(message);
}

// --- Inyectar datos de marca en placeholders [data-site] ---
function fillBrandData() {
  $$("[data-site]").forEach((el) => {
    const key = el.dataset.site;
    if (SITE[key] != null) el.textContent = SITE[key];
  });
  // Enlaces de WhatsApp genéricos
  $$("[data-wa]").forEach((el) => {
    const msg = el.dataset.wa || `¡Hola ${SITE.brand}! Me gustaría más información.`;
    el.href = waLink(msg);
    el.target = "_blank";
    el.rel = "noopener";
  });
  // Enlaces tel / mail
  $$("[data-tel]").forEach((el) => (el.href = "tel:" + SITE.phone.replace(/\s/g, "")));
  $$("[data-mail]").forEach((el) => (el.href = "mailto:" + SITE.email));
}

// --- Tarjeta de producto ---
function productCard(p) {
  const tagHtml = p.tag
    ? `<span class="product-tag ${p.tag}">${p.tag === "oferta" ? "Oferta" : "Nuevo"}</span>`
    : "";
  const oldHtml = p.oldPrice ? `<span class="was">${money(p.oldPrice)}</span>` : "";
  const msg = `¡Hola ${SITE.brand}! Me interesa el producto: ${p.name} (${money(p.price)}). ¿Está disponible?`;
  return `
    <article class="product-card reveal" data-category="${p.category}">
      <div class="product-media">
        ${tagHtml}
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-body">
        <span class="product-cat">${catName(p.category)}</span>
        <h3>${p.name}</h3>
        <p class="product-specs">${p.specs}</p>
        <div class="product-foot">
          <div class="product-price">
            ${oldHtml}
            <span class="now">${money(p.price)}</span>
          </div>
          <a class="btn btn-whatsapp btn-sm" href="${waLink(msg)}" target="_blank" rel="noopener">
            ${ICONS.whatsapp} Consultar
          </a>
        </div>
      </div>
    </article>`;
}

function catName(id) {
  const c = CATEGORIES.find((c) => c.id === id);
  return c ? c.short : id;
}

// --- Categorías (home) ---
function renderCategories() {
  const grid = $("#cat-grid");
  if (!grid) return;
  grid.innerHTML = CATEGORIES.map(
    (c) => `
    <a class="cat-card reveal" href="catalogo.html?cat=${c.id}">
      <img src="${c.img}" alt="${c.name}" loading="lazy">
      <span class="arrow">${ICONS.arrow}</span>
      <div class="cat-body">
        <span class="count">${c.count}</span>
        <h3>${c.name}</h3>
      </div>
    </a>`
  ).join("");
}

// --- Productos destacados (home) ---
function renderFeatured() {
  const grid = $("#featured-grid");
  if (!grid) return;
  const featured = Store.getProducts().slice(0, 4);
  grid.innerHTML = featured.map(productCard).join("");
}

// --- Catálogo con filtros ---
function renderCatalog() {
  const grid = $("#catalog-grid");
  if (!grid) return;
  const filterBar = $("#filters");

  // Construir botones de filtro
  const filters = [{ id: "all", short: "Todos" }, ...CATEGORIES];
  filterBar.innerHTML = filters
    .map(
      (f) => `<button class="filter-btn" data-filter="${f.id}">${f.short}</button>`
    )
    .join("");

  function apply(cat) {
    const all = Store.getProducts();
    const list = cat === "all" ? all : all.filter((p) => p.category === cat);
    grid.innerHTML = list.length
      ? list.map(productCard).join("")
      : `<p class="no-results">No hay productos en esta categoría todavía.</p>`;
    $$(".filter-btn", filterBar).forEach((b) =>
      b.classList.toggle("active", b.dataset.filter === cat)
    );
    revealObserve();
  }

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    apply(btn.dataset.filter);
    history.replaceState(null, "", btn.dataset.filter === "all" ? "catalogo.html" : `?cat=${btn.dataset.filter}`);
  });

  // Categoría inicial desde la URL (?cat=...)
  const params = new URLSearchParams(location.search);
  const initial = params.get("cat");
  apply(initial && CATEGORIES.some((c) => c.id === initial) ? initial : "all");
}

// --- Menú móvil ---
function initNav() {
  const toggle = $("#nav-toggle");
  const nav = $("#main-nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  $$("a", nav).forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
}

// --- Año en footer ---
function setYear() {
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

// --- Animación reveal on scroll ---
let revealObserver;
function revealObserve() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            revealObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }
  $$(".reveal:not(.in)").forEach((el) => revealObserver.observe(el));
}

// --- Toast ---
function toast(msg) {
  let t = $(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 4000);
}

// --- Formulario de contacto → WhatsApp ---
function initContactForm() {
  const form = $("#contact-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const msg =
      `¡Hola ${SITE.brand}! Mi nombre es ${data.get("nombre")}.\n` +
      `Asunto: ${data.get("asunto")}\n` +
      `Mensaje: ${data.get("mensaje")}\n` +
      `Mi correo: ${data.get("email")} · Tel: ${data.get("telefono") || "—"}`;
    window.open(waLink(msg), "_blank", "noopener");
    toast("Te redirigimos a WhatsApp para enviar tu mensaje ✓");
    form.reset();
  });
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  fillBrandData();
  renderCategories();
  renderFeatured();
  renderCatalog();
  initNav();
  initContactForm();
  setYear();
  revealObserve();
});
