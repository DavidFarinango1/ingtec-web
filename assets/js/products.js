/* ============================================================
   Ingetec — Configuración del sitio y catálogo de productos
   Edita este archivo para cambiar datos de contacto y productos.
   ============================================================ */

const SITE = {
  brand: "Ingetec",
  phone: "+593 98 745 2842",
  whatsapp: "593987452842", // solo dígitos, con código de país
  email: "ingetec_service@hotmail.com",
  address: "Antonio Ante Oe2-17 y Manuel Larrea, Quito, Ecuador",
  hours: "Lun a Vie 9:00 – 19:00 · Sáb 9:00 – 14:00",
  facebook: "https://www.facebook.com/profile.php?id=100063901910527",
  mapsQuery: "Antonio+Ante+y+Manuel+Larrea+Quito",
};

// Categorías (las imágenes usan Unsplash)
const CATEGORIES = [
  {
    id: "televisores",
    name: "Televisores Smart TV",
    short: "Televisores",
    count: "9 modelos",
    img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "computadoras",
    name: "Computadoras y Laptops",
    short: "Computadoras",
    count: "Próximamente",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "componentes",
    name: "Componentes y Periféricos",
    short: "Componentes",
    count: "Próximamente",
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "celulares",
    name: "Celulares y Tablets",
    short: "Celulares",
    count: "Próximamente",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "redes",
    name: "Redes, Cámaras y Más",
    short: "Redes & Seguridad",
    count: "Próximamente",
    img: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80",
  },
];

// Catálogo de productos — Televisores (precios con IVA incluido)
const PRODUCTS = [
  // ---------- SAMSUNG ----------
  {
    id: 1,
    name: 'TV Samsung 32" Smart HD',
    category: "televisores",
    specs: 'Televisor Samsung 32" Smart HD LED TV',
    price: 240.35,
    oldPrice: 261.26,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: 'TV Samsung 50" QLED 4K',
    category: "televisores",
    specs: 'Samsung 50" QLED 4K Smart TV · HDMI / AV / Bluetooth / Dolby',
    price: 496.80,
    oldPrice: 540,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: 'TV Samsung 75" UHD 4K',
    category: "televisores",
    specs: 'Samsung 75" LED UHD 4K Smart TV · HDMI / USB / Bluetooth / WiFi',
    price: 1025.80,
    oldPrice: 1115,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1571415060716-baff5f717c8c?auto=format&fit=crop&w=800&q=80",
  },
  // ---------- TCL ----------
  {
    id: 4,
    name: 'TV TCL 42" QLED Full HD',
    category: "televisores",
    specs: 'TCL 42" QLED 1080p Full HD Smart WiFi · Google TV',
    price: 302.39,
    oldPrice: 328.69,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1601944179066-29786cb9d32a?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: 'TV TCL 55" LED 4K UHD',
    category: "televisores",
    specs: 'TCL 55" LED 4K UHD Smart · Google TV',
    price: 490.08,
    oldPrice: 532.70,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: 'TV TCL 75" LED 4K UHD',
    category: "televisores",
    specs: 'TCL 75" LED 4K UHD Smart WiFi · Google TV',
    price: 909.88,
    oldPrice: 989,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1552975084-6e027cd345c2?auto=format&fit=crop&w=800&q=80",
  },
  // ---------- LG ----------
  {
    id: 7,
    name: 'TV LG 43" LED FHD webOS',
    category: "televisores",
    specs: 'LG 43LR6700PSA 43" LED FHD · webOS',
    price: 335.79,
    oldPrice: 364.99,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1539786774582-0707555f1f72?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    name: 'TV LG 50" 4K UHD webOS',
    category: "televisores",
    specs: 'LG WebOS LED 50" 4K UHD · 50UA7500PSA',
    price: 436.08,
    oldPrice: 474,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    name: 'TV LG 65" 4K UHD ThinQ AI',
    category: "televisores",
    specs: 'LG 65" LED 4K UHD Smart webOS · ThinQ AI',
    price: 715.44,
    oldPrice: 777.66,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=800&q=80",
  },
];
