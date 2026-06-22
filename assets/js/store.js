/* ============================================================
   Ingtec — Capa de almacenamiento (localStorage)
   Permite que el panel de administrador modifique el catálogo
   y que esos cambios se reflejen en el sitio (en este navegador).
   ============================================================ */

const STORE_KEY = "ingtec_products_v1";

const Store = {
  /** Devuelve los productos guardados o, si no hay, los de products.js */
  getProducts() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) return arr;
      }
    } catch (e) {
      console.warn("No se pudo leer el catálogo guardado:", e);
    }
    return Array.isArray(typeof PRODUCTS !== "undefined" ? PRODUCTS : null)
      ? PRODUCTS.slice()
      : [];
  },

  /** Guarda el catálogo completo en localStorage */
  saveProducts(arr) {
    localStorage.setItem(STORE_KEY, JSON.stringify(arr));
  },

  /** ¿Hay cambios guardados que difieren del archivo original? */
  hasOverride() {
    return localStorage.getItem(STORE_KEY) != null;
  },

  /** Vuelve a los productos originales de products.js */
  reset() {
    localStorage.removeItem(STORE_KEY);
  },

  /** Genera un id nuevo (máximo actual + 1) */
  nextId(arr) {
    const list = arr || this.getProducts();
    return list.reduce((max, p) => Math.max(max, Number(p.id) || 0), 0) + 1;
  },
};
