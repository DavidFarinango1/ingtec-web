/* ============================================================
   Ingetec — Panel de administrador (Firebase Auth + Firestore)
   El acceso es con correo y contraseña (Firebase Authentication).
   Los productos se guardan en Firestore y se publican al instante
   para todos los visitantes del sitio.
   ============================================================ */

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const money = (n) =>
  "$" + Number(n).toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const auth = firebase.auth();
const productsCol = () => db.collection("products");
const categoriesCol = () => db.collection("categories");

let editingId = null; // null = creando nuevo

/* ---------------- Login (Firebase Auth) ---------------- */
function initLogin() {
  // Mantiene la sesión iniciada entre visitas
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).catch(() => {});

  auth.onAuthStateChanged((user) => {
    const isAdmin = user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    if (user && !isAdmin) {
      // Alguien autenticado pero no autorizado
      $("#login-error").textContent = "Esta cuenta no tiene permisos de administrador.";
      auth.signOut();
      return;
    }
    $("#login-view").style.display = isAdmin ? "none" : "grid";
    $("#dashboard-view").style.display = isAdmin ? "block" : "none";
    if (isAdmin) initDashboard();
  });

  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#admin-email").value.trim();
    const pass = $("#admin-pin").value;
    const btn = $("#login-btn");
    $("#login-error").textContent = "";
    btn.disabled = true;
    btn.textContent = "Ingresando...";
    auth.signInWithEmailAndPassword(email, pass)
      .catch((err) => {
        $("#login-error").textContent = authErrorMsg(err.code);
        $("#admin-pin").value = "";
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = "Ingresar";
      });
  });

  $("#logout-btn").addEventListener("click", () => auth.signOut());
}

function authErrorMsg(code) {
  switch (code) {
    case "auth/invalid-email":
      return "El correo no es válido.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Correo o contraseña incorrectos.";
    case "auth/too-many-requests":
      return "Demasiados intentos. Espera un momento e intenta de nuevo.";
    case "auth/network-request-failed":
      return "Sin conexión. Revisa tu internet.";
    default:
      return "No se pudo iniciar sesión. Intenta de nuevo.";
  }
}

/* ---------------- Dashboard ---------------- */
let dashboardReady = false;
function initDashboard() {
  if (dashboardReady) return;
  dashboardReady = true;

  bindForm();
  bindCategoryForm();

  // Productos y categorías en tiempo real desde Firestore
  Store.onChange(() => {
    fillCategorySelect();
    renderList();
    renderCatList();
  });

  $("#search").addEventListener("input", renderList);
  $("#new-btn").addEventListener("click", () => resetForm());
  $("#export-json").addEventListener("click", exportJson);
}

// Rellena el <select> de categorías conservando la selección actual
function fillCategorySelect() {
  const sel = $("#f-category");
  if (!sel) return;
  const current = sel.value;
  const cats = Store.getCategories();
  sel.innerHTML = cats.map((c) => `<option value="${c.id}">${c.name}</option>`).join("");
  if (current && cats.some((c) => c.id === current)) sel.value = current;
}

function catName(id) {
  const c = Store.getCategories().find((c) => c.id === id);
  return c ? c.short || c.name : id;
}

/* ---------------- Lista de productos ---------------- */
function renderList() {
  const list = $("#admin-list");
  if (!list) return;
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
    b.addEventListener("click", () => editProduct(b.dataset.edit))
  );
  $$("[data-del]", list).forEach((b) =>
    b.addEventListener("click", () => deleteProduct(b.dataset.del))
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
  const p = Store.getProducts().find((x) => String(x.id) === String(id));
  if (!p) return;
  editingId = id;
  const cats = Store.getCategories();
  $("#f-name").value = p.name || "";
  $("#f-category").value = p.category || (cats[0] && cats[0].id) || "";
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

async function saveProduct() {
  const data = {
    name: $("#f-name").value.trim(),
    category: $("#f-category").value,
    specs: $("#f-specs").value.trim(),
    price: Number($("#f-price").value) || 0,
    tag: $("#f-tag").value || "",
    img: $("#f-img").value.trim(),
  };
  const oldPrice = $("#f-oldprice").value ? Number($("#f-oldprice").value) : null;
  data.oldPrice = oldPrice; // null si no aplica (se puede limpiar al editar)

  if (!data.name || !data.price) {
    toast("El nombre y el precio son obligatorios.");
    return;
  }

  const btn = $("#product-form button[type=submit]");
  btn.disabled = true;

  try {
    if (editingId != null) {
      await productsCol().doc(String(editingId)).set(data, { merge: true });
      toast("Producto actualizado ✓");
    } else {
      data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      await productsCol().add(data);
      toast("Producto agregado ✓");
    }
    resetForm();
    // La lista se refresca sola por el listener en tiempo real
  } catch (err) {
    console.error(err);
    toast(saveErrorMsg(err));
  } finally {
    btn.disabled = false;
  }
}

function saveErrorMsg(err) {
  if (err && err.code === "permission-denied")
    return "No tienes permisos para guardar. Vuelve a iniciar sesión.";
  return "No se pudo guardar. Revisa tu conexión e intenta de nuevo.";
}

async function deleteProduct(id) {
  const p = Store.getProducts().find((x) => String(x.id) === String(id));
  if (!p) return;
  if (!confirm(`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`)) return;
  try {
    await productsCol().doc(String(id)).delete();
    if (String(editingId) === String(id)) resetForm();
    toast("Producto eliminado");
  } catch (err) {
    console.error(err);
    toast(saveErrorMsg(err));
  }
}

/* ---------------- Categorías ---------------- */
// Convierte "Laptops y Computadoras" -> "laptops-y-computadoras"
function slugify(s) {
  return String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita acentos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function bindCategoryForm() {
  const form = $("#category-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    saveCategory();
  });
}

async function saveCategory() {
  const name = $("#c-name").value.trim();
  const short = $("#c-short").value.trim();
  const img = $("#c-img").value.trim();
  if (!name) {
    toast("Escribe el nombre de la categoría.");
    return;
  }

  const cats = Store.getCategories();
  // Genera un id único a partir del nombre
  let base = slugify(name) || "categoria";
  let id = base;
  let n = 2;
  while (cats.some((c) => c.id === id)) id = `${base}-${n++}`;

  const order = cats.reduce((max, c) => Math.max(max, typeof c.order === "number" ? c.order : 0), 0) + 1;

  const btn = $("#category-form button[type=submit]");
  btn.disabled = true;
  try {
    await categoriesCol().doc(id).set({
      name,
      short: short || name,
      img,
      order,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    $("#category-form").reset();
    toast("Categoría creada ✓");
    // La lista se refresca sola por el listener en tiempo real
  } catch (err) {
    console.error(err);
    toast(saveErrorMsg(err));
  } finally {
    btn.disabled = false;
  }
}

async function deleteCategory(id) {
  const cats = Store.getCategories();
  const c = cats.find((x) => x.id === id);
  if (!c) return;
  const count = Store.getProducts().filter((p) => p.category === id).length;
  if (count > 0) {
    toast(`No puedes eliminar "${c.name}": tiene ${count} producto(s). Muévelos o elimínalos primero.`);
    return;
  }
  if (!confirm(`¿Eliminar la categoría "${c.name}"?`)) return;
  try {
    await categoriesCol().doc(id).delete();
    toast("Categoría eliminada");
  } catch (err) {
    console.error(err);
    toast(saveErrorMsg(err));
  }
}

function renderCatList() {
  const box = $("#cat-list");
  if (!box) return;
  const cats = Store.getCategories();
  if (!cats.length) {
    box.innerHTML = `<p class="admin-empty">No hay categorías todavía.</p>`;
    return;
  }
  box.innerHTML = cats
    .map((c) => {
      const count = Store.getProducts().filter((p) => p.category === c.id).length;
      return `
    <div class="cat-chip">
      <div class="cat-chip-meta">
        <strong>${c.name}</strong>
        <span>${count} producto(s)</span>
      </div>
      <button class="icon-btn danger" title="Eliminar categoría" data-delcat="${c.id}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
      </button>
    </div>`;
    })
    .join("");
  $$("[data-delcat]", box).forEach((b) =>
    b.addEventListener("click", () => deleteCategory(b.dataset.delcat))
  );
}

/* ---------------- Respaldo JSON ---------------- */
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

function exportJson() {
  const clean = Store.getProducts().map(({ createdAt, ...rest }) => rest);
  download("productos-backup.json", JSON.stringify(clean, null, 2), "application/json");
  toast("Respaldo JSON descargado ✓");
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
