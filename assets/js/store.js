/* ============================================================
   Ingetec — Capa de datos (Firestore en la nube)
   Lee los productos de Firestore en tiempo real. Si Firebase no
   está disponible, usa como respaldo los productos de products.js.
   El sitio y el panel comparten esta capa: lo que el admin guarda
   se ve al instante para todos los visitantes.
   ============================================================ */

const Store = {
  _cache: null, // productos (array) o null si aún no llega
  _cats: null, // categorías (array) o null si aún no llega
  _listeners: [],
  _started: false,

  /** Productos "semilla" del archivo products.js (respaldo offline) */
  seed() {
    return Array.isArray(typeof PRODUCTS !== "undefined" ? PRODUCTS : null)
      ? PRODUCTS.slice()
      : [];
  },

  /** Categorías "semilla" del archivo products.js (respaldo offline) */
  seedCats() {
    return Array.isArray(typeof CATEGORIES !== "undefined" ? CATEGORIES : null)
      ? CATEGORIES.slice()
      : [];
  },

  /** Catálogo actual (cache de Firestore o, si aún no llega, la semilla) */
  getProducts() {
    return this._cache != null ? this._cache : this.seed();
  },

  /** Categorías actuales (cache de Firestore o, si aún no llega, la semilla) */
  getCategories() {
    return this._cats != null ? this._cats : this.seedCats();
  },

  /** Ordena por fecha de creación (los sin fecha van al final por nombre) */
  _sort(list) {
    return list.slice().sort((a, b) => {
      const ta = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
      const tb = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
      if (ta !== tb) return ta - tb;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  },

  /** Ordena categorías por campo "order" y luego por nombre */
  _sortCats(list) {
    return list.slice().sort((a, b) => {
      const oa = typeof a.order === "number" ? a.order : 9999;
      const ob = typeof b.order === "number" ? b.order : 9999;
      if (oa !== ob) return oa - ob;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  },

  /**
   * Suscribe una función que se ejecuta ahora (con lo que haya) y cada vez
   * que cambie el catálogo en Firestore. Devuelve una función para cancelar.
   */
  onChange(cb) {
    this._listeners.push(cb);
    cb(this.getProducts()); // pintado inmediato con la semilla/caché
    this._start();
    return () => {
      this._listeners = this._listeners.filter((f) => f !== cb);
    };
  },

  _notify() {
    const data = this.getProducts();
    this._listeners.forEach((cb) => {
      try {
        cb(data);
      } catch (e) {
        console.error("listener Store:", e);
      }
    });
  },

  /** Arranca los listeners de Firestore una sola vez */
  _start() {
    if (this._started) return;
    this._started = true;
    if (!db) {
      console.warn("Firebase no disponible: usando catálogo local (products.js).");
      return;
    }
    db.collection("products").onSnapshot(
      (snap) => {
        this._cache = this._sort(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        this._notify();
      },
      (err) => console.warn("No se pudo leer productos:", err.message)
    );
    db.collection("categories").onSnapshot(
      (snap) => {
        this._cats = this._sortCats(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        this._notify();
      },
      (err) => console.warn("No se pudo leer categorías:", err.message)
    );
  },
};
