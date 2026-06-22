# Ingtec — Tienda de Tecnología 💻

Sitio web showcase de e-commerce para una tienda de tecnología en Quito, inspirado en la estructura de [bikeuio.com](https://bikeuio.com/). Productos por categorías y pedidos vía **WhatsApp** (sin pasarela de pago ni backend).

Hecho con **HTML + CSS + JavaScript puro** — sin frameworks, sin build, sin dependencias. Solo abre los archivos y funciona.

## 📂 Estructura

```
Ingtec/
├── index.html          # Inicio (hero, categorías, destacados, nosotros, CTA)
├── catalogo.html       # Catálogo con filtros por categoría
├── contacto.html       # Datos de contacto + formulario → WhatsApp
└── assets/
    ├── css/styles.css  # Todos los estilos (tema oscuro tech)
    ├── js/
    │   ├── icons.js    # Íconos SVG inline
    │   ├── products.js # ⭐ DATOS: marca, contacto y catálogo
    │   └── main.js     # Lógica (render, filtros, menú, formulario)
    └── img/            # (para tus propias imágenes, opcional)
```

## ✏️ Cómo personalizar

Casi todo se edita en **`assets/js/products.js`**:

### 1. Datos del negocio
```js
const SITE = {
  brand:    "Ingtec",
  phone:    "+593 99 999 9999",
  whatsapp: "593999999999",   // ⚠️ solo dígitos, con código de país (sin + ni espacios)
  email:    "ventasquito.soporte@gmail.com",
  address:  "Tu dirección, Quito, Ecuador",
  hours:    "Lun a Vie 9:00 – 19:00 · Sáb 9:00 – 14:00",
};
```
> Estos datos se inyectan automáticamente en las 3 páginas (footer, contacto, botones de WhatsApp).

### 2. Productos
Agrega o edita objetos en el arreglo `PRODUCTS`:
```js
{
  id: 13,
  name: "Nombre del producto",
  category: "computadoras",   // computadoras | componentes | celulares | redes
  specs: "Especificaciones cortas",
  price: 999,
  oldPrice: 1199,             // opcional (muestra precio tachado)
  tag: "oferta",             // "oferta" | "nuevo" | "" (vacío)
  img: "URL o assets/img/foto.jpg",
}
```

### 3. Imágenes
Las imágenes de ejemplo vienen de Unsplash (requieren internet). Para usar las tuyas:
1. Copia tus fotos a `assets/img/`.
2. Cambia la ruta en `img:` por `assets/img/tu-foto.jpg`.

### 4. Mapa
En `contacto.html` reemplaza el `src` del `<iframe>` por tu ubicación real de Google Maps (Compartir → Insertar mapa).

## 🚀 Cómo verlo

- **Rápido:** doble clic en `index.html`.
- **Recomendado (servidor local):** evita restricciones del navegador.
  ```bash
  # Con Python instalado
  python -m http.server 8000
  # luego abre http://localhost:8000
  ```

## 🌐 Cómo publicarlo (gratis)

Al ser estático, sube la carpeta a cualquiera de estos:
- **Netlify:** arrastra la carpeta a app.netlify.com/drop.
- **Vercel:** `vercel` desde la carpeta.
- **GitHub Pages:** sube a un repo y activa Pages.
- Cualquier hosting básico (cPanel, etc.): sube los archivos a `public_html`.

## ✅ Funcionalidades

- Diseño responsive (móvil, tablet, escritorio) con menú hamburguesa.
- Catálogo dinámico con filtros por categoría (y enlace directo `catalogo.html?cat=celulares`).
- Botones de WhatsApp con mensaje precargado por producto.
- Formulario de contacto que arma el mensaje y abre WhatsApp.
- Animaciones suaves al hacer scroll.
- Botón flotante de WhatsApp.

---
Hecho con ⚡ en Quito, Ecuador.
