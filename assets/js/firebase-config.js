/* ============================================================
   Ingetec — Configuración de Firebase (nube)
   Inicializa la app, Firestore (base de datos) y deja listo Auth.
   Estos valores son públicos por diseño (config del cliente web);
   la seguridad real vive en las reglas de Firestore.
   ============================================================ */

const firebaseConfig = {
  apiKey: "AIzaSyBhcXL0Hmnk4tlt-JZEKE9bQlsFfaf48do",
  authDomain: "ingtec-web.firebaseapp.com",
  projectId: "ingtec-web",
  storageBucket: "ingtec-web.firebasestorage.app",
  messagingSenderId: "333302308947",
  appId: "1:333302308947:web:e5b80da4b17215b1ed66a6",
};

/* Correo del administrador autorizado a editar el catálogo.
   Debe coincidir EXACTAMENTE con el de las reglas de Firestore. */
const ADMIN_EMAIL = "ventasquito.soporte@gmail.com";

// Inicializa Firebase (SDK "compat" cargado por <script> antes de este archivo)
if (typeof firebase !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Base de datos disponible como global `db` para el resto de scripts
const db = typeof firebase !== "undefined" ? firebase.firestore() : null;
