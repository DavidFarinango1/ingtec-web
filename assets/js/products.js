/* ============================================================
   Ingtec — Configuración del sitio y catálogo de productos
   Edita este archivo para cambiar datos de contacto y productos.
   ============================================================ */

const SITE = {
  brand: "Ingtec",
  phone: "+593 99 999 9999",
  whatsapp: "593999999999", // solo dígitos, con código de país
  email: "ventasquito.soporte@gmail.com",
  address: "Av. Amazonas N34-451 y Av. Atahualpa, Quito, Ecuador",
  hours: "Lun a Vie 9:00 – 19:00 · Sáb 9:00 – 14:00",
  mapsQuery: "Av+Amazonas+y+Atahualpa+Quito",
};

// Categorías (las imágenes usan Unsplash)
const CATEGORIES = [
  {
    id: "computadoras",
    name: "Computadoras y Laptops",
    short: "Computadoras",
    count: "32 modelos",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "componentes",
    name: "Componentes y Periféricos",
    short: "Componentes",
    count: "120+ productos",
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "celulares",
    name: "Celulares y Tablets",
    short: "Celulares",
    count: "45 modelos",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "redes",
    name: "Redes, Cámaras y Más",
    short: "Redes & Seguridad",
    count: "60+ productos",
    img: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80",
  },
];

// Catálogo de productos
const PRODUCTS = [
  {
    id: 1,
    name: "Laptop Gamer ROG Strix 15",
    category: "computadoras",
    specs: "Ryzen 7 · RTX 4060 · 16GB · 1TB SSD",
    price: 1499,
    oldPrice: 1699,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "MacBook Air M3 13\"",
    category: "computadoras",
    specs: "Chip M3 · 8GB · 256GB SSD · macOS",
    price: 1299,
    tag: "nuevo",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "PC de Escritorio Ingtec Pro",
    category: "computadoras",
    specs: "Intel i5 · 16GB · 512GB SSD · Win 11",
    price: 749,
    tag: "",
    img: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Tarjeta Gráfica RTX 4070",
    category: "componentes",
    specs: "12GB GDDR6X · DLSS 3 · Ray Tracing",
    price: 599,
    oldPrice: 679,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    name: "Teclado Mecánico RGB",
    category: "componentes",
    specs: "Switch Red · Hot-swap · USB-C",
    price: 79,
    tag: "",
    img: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    name: "Monitor Curvo 27\" 165Hz",
    category: "componentes",
    specs: "QHD · 1ms · FreeSync · HDR",
    price: 289,
    tag: "nuevo",
    img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    name: "iPhone 15 Pro 256GB",
    category: "celulares",
    specs: "A17 Pro · Titanio · Cámara 48MP",
    price: 1199,
    tag: "",
    img: "https://images.unsplash.com/photo-1592286927505-1def25115558?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 8,
    name: "Samsung Galaxy S24 Ultra",
    category: "celulares",
    specs: "Snapdragon 8 Gen 3 · 12GB · S-Pen",
    price: 1099,
    oldPrice: 1249,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 9,
    name: "Tablet Galaxy Tab S9",
    category: "celulares",
    specs: '11" AMOLED · 8GB · S-Pen incluido',
    price: 649,
    tag: "",
    img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 10,
    name: "Router WiFi 6 Mesh (pack 3)",
    category: "redes",
    specs: "AX5400 · Cobertura 600m² · App",
    price: 219,
    tag: "nuevo",
    img: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 11,
    name: "Kit Cámaras de Seguridad 4K",
    category: "redes",
    specs: "8 canales · Visión nocturna · App móvil",
    price: 379,
    oldPrice: 449,
    tag: "oferta",
    img: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 12,
    name: "Impresora Multifunción WiFi",
    category: "redes",
    specs: "Tinta continua · Escáner · Dúplex",
    price: 189,
    tag: "",
    img: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=800&q=80",
  },
];
