# RustyBurger — Guía para el dueño del negocio

Instrucciones simples para gestionar la web sin tocar código.

---

## 1. Entrar al panel

1. Abrí **https://tu-dominio.com/admin/login** (en local: `http://localhost:3001/admin/login`).
2. Ingresá email y contraseña del administrador.
3. Si no recordás la clave, pedí al desarrollador que la resetee en la base de datos o vuelva a ejecutar el seed con `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

> El panel no es visible para clientes. Sin login no se puede acceder a `/admin/*`.

---

## 2. Gestionar productos

**Menú lateral → Productos**

| Acción | Cómo |
|--------|------|
| Ver todos | `/admin/productos` — filtrá por nombre, categoría, activo, disponible, destacado |
| Crear | **Nuevo producto** → completar nombre, precio, descripción → Guardar |
| Editar | Click **Editar** en la fila o abrí `/admin/productos/[id]` |
| Activar / desactivar | Botón rápido en el listado |
| Disponible / no disponible | Botón rápido en el listado |
| Destacar | Botón rápido en el listado |
| Eliminar | **Eliminar** → confirmar (no se puede deshacer) |

**Importante:** un producto aparece en `/menu` solo si está **activo** y **disponible**.

---

## 3. Subir y usar imágenes

**Menú lateral → Imágenes**

1. Click **Elegir archivo** (JPEG, PNG o WEBP — máximo 5 MB).
2. La imagen queda en la biblioteca.
3. Podés **copiar URL** para usarla donde quieras.

**En productos, categorías o promos:**

- Usá el selector de imagen (**Subir imagen** o **Biblioteca**).
- También podés pegar una URL manual (por ejemplo `/rusty/products/classica.svg`).

> Si falta `BLOB_READ_WRITE_TOKEN` en el servidor, el upload no funciona pero las URLs manuales sí.

---

## 4. Categorías

**Menú lateral → Categorías**

- Crear, editar, activar/desactivar.
- **No se puede eliminar** una categoría que tenga productos vinculados — primero reasigná o eliminá los productos.

---

## 5. Promociones

**Menú lateral → Promos**

- Crear, editar, activar/desactivar, fechas de vigencia opcionales.
- Precio opcional.

> La página pública `/promos` usa diseño motion fijo. Las promos del admin quedan en la base y en la API pública (`/api/public/promos`) para futuras integraciones o apps.

---

## 6. Ver y gestionar pedidos

**Menú lateral → Pedidos**

1. Lista de pedidos con filtro por estado.
2. Click **Ver** para abrir el detalle.
3. Cambiá el estado (Recibido → Confirmado → Preparación → Listo → En camino → Entregado).
4. El cliente ve el cambio al recargar su link: `/pedido/RB-XXXXXX`.

**Dashboard:** métricas del día, pedidos activos y facturación.

---

## 7. Datos del negocio (configuración)

**Menú lateral → Configuración**

| Sección | Qué editar |
|---------|------------|
| Datos del negocio | Nombre, dirección, horarios |
| Contacto y redes | Teléfono, WhatsApp, Instagram, iFood |
| Delivery / retiro | Activar delivery/retiro, costo envío, pedido mínimo |
| SEO | Título y descripción para buscadores |
| Mensaje superior | Texto tipo “Feast Mode On” |

**WhatsApp en botones de la web:** hoy los botones principales usan la variable de entorno `NEXT_PUBLIC_WHATSAPP_NUMBER`. Si cambiás WhatsApp en Configuración, también actualizá esa variable en Vercel (o pedí al desarrollador) para que todos los botones coincidan.

---

## 8. Flujo del cliente (para entender)

1. Cliente entra a `/menu`, agrega productos al carrito.
2. Va a `/checkout`, completa datos y confirma.
3. Recibe código `RB-XXXXXX` y link de seguimiento.
4. Vos ves el pedido en **Pedidos** y actualizás el estado.

---

## 9. Si algo no funciona

| Síntoma | Qué revisar |
|---------|-------------|
| No carga el menú desde DB | `DATABASE_URL` en Vercel + migraciones ejecutadas |
| No puedo entrar al admin | `JWT_SECRET` configurado + usuario seed creado |
| No sube imágenes | `BLOB_READ_WRITE_TOKEN` en Vercel |
| Pedidos no se crean | Base de datos activa y migrada |
| Build / deploy falla | Variables de entorno completas |

Contactá al desarrollador con el mensaje de error exacto que ves en pantalla.
