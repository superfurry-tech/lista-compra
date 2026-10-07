# 🛒 ListApp (Lista_compra) - Web App Multi-Familia

Aplicación web ligera (PWA) de lista de la compra compartida en tiempo real, diseñada con una arquitectura Multi-Familia (Multi-tenant), acceso sin fricción mediante PIN de hogar y persistencia local sin contraseñas individuales.

---

## 🚀 Características Principales

* 🛒 **Sincronización en Tiempo Real:** Añade, marca y elimina productos al instante desde cualquier dispositivo.
* 🏠 **Arquitectura Multi-Familia:** Aislamiento de datos para múltiples hogares independientes mediante un PIN de 4 dígitos por familia.
* 👤 **Identificación Dinámica:** Cada integrante del hogar introduce su nombre libremente sin depender de usuarios prefijados.
* 📱 **Experiencia PWA / Mobile-First:** Interfaz adaptada a smartphones con soporte para instalación en la pantalla de inicio (manifest.json e icono oficial).
* 🔒 **Persistencia Local (Cero Fricción):** Guarda la sesión (localStorage) en el navegador del móvil para entrar directo a la lista en visitas futuras.
* 🌐 **Acceso Remoto Seguro:** Desplegado mediante HTTPS con Cloudflare Tunnel, accesible desde cualquier red sin necesidad de VPN.

---

## 🛠️ Stack Tecnológico

* **Frontend:** HTML5, CSS3 (diseño responsive), JavaScript ES6 (Fetch API, LocalStorage).
* **Backend:** PHP (API RESTful en el servidor web).
* **Base de Datos:** MariaDB.
* **Servidor e Infraestructura:** Servidor LAMP en entorno Linux (MX Linux / Apache), cifrado HTTPS vía Cloudflare Tunnel y acceso SSH con Tailscale.

---

## 📁 Estructura del Repositorio

```text
.
├── index.html                # Frontend principal de la aplicación (UI / UX / JS)
├── manifest.json             # Configuración PWA (nombre, colores e icono)
├── lista-de-verificacion.png # Icono oficial de la aplicación
└── README.md                 # Documentación del proyecto
