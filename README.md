# 🛒 ListApp — Lista de la Compra

Aplicación web (PWA) para compartir listas de la compra entre diferentes grupos, con acceso mediante un PIN y datos almacenados en un servidor propio.

## 🚀 Características

- 🏠 **Múltiples grupos:** Cada grupo tiene su propia lista de la compra.
- 🛒 **Lista compartida:** Permite añadir, marcar como comprados y eliminar productos desde distintos dispositivos.
- 👤 **Identificación:** Cada integrante introduce su nombre para identificar quién compra los productos.
- 📱 **PWA:** Adaptada a móviles, con posibilidad de añadirla a la pantalla de inicio.
- 💾 **Persistencia local:** Recuerda el grupo y el nombre del usuario mediante `localStorage`.
- 🌐 **Acceso remoto:** Disponible mediante HTTPS a través de Cloudflare Tunnel.

## 🛠️ Tecnologías

- **Frontend:** HTML, CSS y JavaScript.
- **Backend:** PHP.
- **Base de datos:** MariaDB.
- **Servidor:** Apache sobre MX Linux.
- **Conectividad:** Cloudflare Tunnel y Tailscale.
- **Control de versiones:** Git y GitHub.

## 📁 Estructura del repositorio

```text
.
├── index.html                 # Estructura HTML
├── styles.css                 # Estilos CSS
├── app.js                     # Lógica JavaScript
├── api.php                    # Backend PHP y conexión con MariaDB
├── manifest.json              # Configuración PWA
├── lista-de-verificacion.png  # Icono de la aplicación
└── README.md                  # Documentación
```

## 📌 Estado del proyecto

Aplicación operativa y en desarrollo, con futuras mejoras previstas en la gestión de miembros, seguridad y nuevas funcionalidades.