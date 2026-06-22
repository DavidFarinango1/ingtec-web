/* ============================================================
   Ingtec — Panel de administrador
   Gestiona el catálogo en el navegador (localStorage) y permite
   exportar el archivo products.js para subirlo a GitHub.
   ============================================================ */

/* 🔐 Cambia esta contraseña. NOTA: es seguridad básica del lado del
   cliente (cualquiera con conocimientos puede verla en el código).
   Para datos sensibles necesitarías un backend real. */
const ADMIN_PIN = "ingtec2024";
const SESSION_KEY = "ingtec_admin_ok";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const money = (n) => "$" + Number(n).toLocaleString("es-EC");

let editingId = null; // null = creando nuevo

/* ---------------- Login ---------------- */
function initLogin() {
  const ok = sessionStorage.getItem(SESSION_KEY) === "1";
  $("#login-view").style.display = ok ? "none" : "grid";
  $("#dashboard-view").style.display = ok ? "block" : "none";
  if (ok) initDashboard();

  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const val = $("#admin-pin").value;
    if (val === ADMIN_PIN) {
      sessionStorage.setItem(SESSION_KEY, "1");
      $("#login-view").style.display = "none";
      $("#dashboard-view").style.display = "block";
      initDashboard();
    } else {
      $("#login-error").textContent = "Contraseña incorrecta. Intenta de nuevo.";
      $("#admin-pin").value = "";
    }
  });

  $("#logout-btn").addEventListener("click", () => {
    sessionStorage.removeItem(SESSION_KEY);
    location.reload();
  });
}

/* ---------------- Dashboard ---------------- */
let dashboardReady = false;
function initDashboard() {
  if (dashboardReady) {
    renderList();
    return;
  }
  dashboardReady = true;

  fillCategorySelect();
  renderList();
  bindForm();

  $("#search").addEventListener("input", renderList);
  $("#new-btn").addEventListener("click", () => resetForm());
  $("#export-js").addEventListener("click", exportProductsJs);
  $("#export-json").addEventListener("click", exportJson);
  $("#import-json").addEventListener("change", importJson);
  $("#reset-btn").addEventListener("click", resetCatalog);
}

function fillCategorySelect() {
  const sel = $("#f-category");
  sel.innerHTML = CATEGORIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
}

function catName(id) {
  const c = CATEGORIES.find((c) => c.id === id);
  return c ? c.short : id;
}

/* ---------------- Lista de productos ---------------- */
function renderList() {
  const list = $("#admin-list");
  const q = ($("#search").value || "").toLowerCase().trim();
  let products = Store.getProducts();
  if (q) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        catName(p.category).toLowerCase().includes(q)
    );
  }
  $("#count").textContent = `${products.length} producto(s)`;

  if (!products.length) {
    list.innerHTML = `<p class="admin-empty">No hay productos. Agrega el primero con el formulario. 👉</p>`;
    return;
  }

  list.innerHTML = products
    .map(
      (p) => `
    <div class="admin-item">
      <img src="${p.img || ""}" alt="${p.name}" onerror="this.style.opacity=.2">
      <div class="meta">
        <h4>${p.name}</h4>
        <span>${catName(p.category)} · <span class="price">${money(p.price)}</span>${
        p.tag ? " · " + p.tag : ""
      }</span>
      </div>
      <div class="acts">
        <button class="icon-btn" title="Editar" data-edit="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
        <button class="icon-btn danger" title="Eliminar" data-del="${p.id}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
        </button>
      </div>
    </div>`
    )
    .join("");

  $$("[data-edit]", list).forEach((b) =>
    b.addEventListener("click", () => editProduct(Number(b.dataset.edit)))
  );
  $$("[data-del]", list).forEach((b) =>
    b.addEventListener("click", () => deleteProduct(Number(b.dataset.del)))
  );
}

/* ---------------- Formulario ---------------- */
function bindForm() {
  const form = $("#product-form");

  // Vista previa al escribir URL
  $("#f-img").addEventListener("input", () => setPreview($("#f-img").value));

  // Subir imagen como archivo (base64)
  $("#f-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      toast("La imagen es muy pesada (máx. 1.5 MB). Usa una más liviana o una URL.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      $("#f-img").value = reader.result;
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveProduct();
  });

  $("#cancel-btn").addEventListener("click", () => resetForm());
}

function setPreview(src) {
  const box = $("#img-preview");
  box.innerHTML = src
    ? `<img src="${src}" alt="preview" onerror="this.parentNode.textContent='No se pudo cargar la imagen'">`
    : "Vista previa de la imagen";
}

function resetForm() {
  editingId = null;
  $("#product-form").reset();
  $("#form-title").textContent = "Nuevo producto";
  $("#save-label").textContent = "Agregar producto";
  $("#cancel-btn").style.display = "none";
  setPreview("");
}

function editProduct(id) {
  const p = Store.getProducts().find((x) => x.id === id);
  if (!p) return;
  editingId = id;
  $("#f-name").value = p.name || "";
  $("#f-category").value = p.category || CATEGORIES[0].id;
  $("#f-specs").value = p.specs || "";
  $("#f-price").value = p.price || "";
  $("#f-oldprice").value = p.oldPrice || "";
  $("#f-tag").value = p.tag || "";
  $("#f-img").value = p.img || "";
  setPreview(p.img || "");
  $("#form-title").textContent = "Editar producto";
  $("#save-label").textContent = "Guardar cambios";
  $("#cancel-btn").style.display = "inline-flex";
  $("#product-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

function saveProduct() {
  const products = Store.getProducts();
  const data = {
    name: $("#f-name").value.trim(),
    category: $("#f-category").value,
    specs: $("#f-specs").value.trim(),
    price: Number($("#f-price").value) || 0,
    oldPrice: $("#f-oldprice").value ? Number($("#f-oldprice").value) : undefined,
    tag: $("#f-tag").value,
    img: $("#f-img").value.trim(),
  };
  if (!data.name || !data.price) {
    toast("El nombre y el precio son obligatorios.");
    return;
  }
  // limpia oldPrice undefined para no guardar basura
  if (!data.oldPrice) delete data.oldPrice;

  if (editingId != null) {
    const idx = products.findIndex((p) => p.id === editingId);
    products[idx] = { ...products[idx], ...data, id: editingId };
    toast("Producto actualizado ✓");
  } else {
    products.push({ id: Store.nextId(products), ...data });
    toast("Producto agregado ✓");
  }
  Store.saveProducts(products);
  resetForm();
  renderList();
}

function deleteProduct(id) {
  const p = Store.getProducts().find((x) => x.id === id);
  if (!p) return;
  if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
  const products = Store.getProducts().filter((x) => x.id !== id);
  Store.saveProducts(products);
  if (editingId === id) resetForm();
  renderList();
  toast("Producto eliminado");
}

/* ---------------- Exportar / Importar ---------------- */
function download(filename, content, type) {
  const blob = new Blob([content], { type: type || "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Genera un products.js completo listo para reemplazar el archivo */
function exportProductsJs() {
  const products = Store.getProducts();
  const header =
    "/* ============================================================\n" +
    "   Ingtec — Configuración del sitio y catálogo de productos\n" +
    "   Generado desde el panel de administrador.\n" +
    "   ============================================================ */\n\n";
  const content =
    header +
    "const SITE = " + JSON.stringify(SITE, null, 2) + ";\n\n" +
    "const CATEGORIES = " + JSON.stringify(CATEGORIES, null, 2) + ";\n\n" +
    "const PRODUCTS = " + JSON.stringify(products, null, 2) + ";\n";
  download("products.js", content, "text/javascript;charset=utf-8");
  toast("products.js descargado. Reemplázalo en assets/js/ y haz git push.");
}

function exportJson() {
  download("productos-backup.json", JSON.stringify(Store.getProducts(), null, 2), "application/json");
  toast("Respaldo JSON descargado ✓");
}

function importJson(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const arr = JSON.parse(reader.result);
      if (!Array.isArray(arr)) throw new Error("formato inválido");
      Store.saveProducts(arr);
      renderList();
      toast(`Importados ${arr.length} producto(s) ✓`);
    } catch (err) {
      toast("Archivo JSON inválido.");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
}

function resetCatalog() {
  if (!confirm("¿Restaurar el catálogo original de products.js? Se perderán los cambios guardados en este navegador.")) return;
  Store.reset();
  resetForm();
  renderList();
  toast("Catálogo restaurado al original");
}

/* ---------------- Toast ---------------- */
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
  t._timer = setTimeout(() => t.classList.remove("show"), 4500);
}

document.addEventListener("DOMContentLoaded", () => {
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
  initLogin();
});
