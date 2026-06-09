# RustyBurger Premium

Web brutalista con motion design para **Rusty Food House**. Next.js 14, Tailwind, Framer Motion, Prisma + PostgreSQL, panel admin autogestionable.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completar variables
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Abre [http://localhost:3001](http://localhost:3001).

## Build

```bash
npm run build
```

El build **no requiere** base de datos activa. Las APIs devuelven 503 controlado si falta `DATABASE_URL`.

---

## Entrega / uso del cliente

Guía detallada para el dueño: **[docs/ENTREGA_CLIENTE.md](docs/ENTREGA_CLIENTE.md)**  
Checklist QA final: **[docs/QA_FINAL_RUSTYBURGER.md](docs/QA_FINAL_RUSTYBURGER.md)**

### Crear administrador

1. Definí en `.env.local` (o Vercel):

```
ADMIN_EMAIL=admin@rustyburger.com
ADMIN_PASSWORD=tu-password-seguro
JWT_SECRET=un-secreto-largo-aleatorio
DATABASE_URL=postgresql://...
```

2. Ejecutá el seed:

```bash
npm run db:seed
```

3. Entrá a `/admin/login` con ese email y contraseña.

### Panel admin — qué puede hacer el dueño

| Sección | Ruta | Función |
|---------|------|---------|
| Dashboard | `/admin/dashboard` | Métricas de pedidos |
| Pedidos | `/admin/pedidos` | Ver y cambiar estados |
| Productos | `/admin/productos` | CRUD menú, precios, imágenes |
| Categorías | `/admin/categorias` | Organizar el menú |
| Promos | `/admin/promos` | Ofertas en base de datos |
| Imágenes | `/admin/imagenes` | Subir y biblioteca media |
| Configuración | `/admin/configuracion` | Datos del negocio, delivery, SEO |

### Flujo típico del dueño

1. **Subir imagen** → Imágenes → elegir archivo.
2. **Crear producto** → Productos → Nuevo → imagen desde biblioteca → activo + disponible → Guardar.
3. **Ver en web** → `/menu` (productos activos y disponibles).
4. **Recibir pedido** → Pedidos → abrir → cambiar estado.
5. **Cliente sigue pedido** → `/pedido/RB-XXXXXX`.

### Cambiar WhatsApp / horarios

- **Configuración** en el panel guarda datos en la base.
- Los **botones WhatsApp** de la web usan `NEXT_PUBLIC_WHATSAPP_NUMBER` — actualizá también esa variable en Vercel para que coincida con el panel.

---

## Deploy en Vercel

### 1. Variables de entorno (Production)

| Variable | Obligatoria | Uso |
|----------|-------------|-----|
| `DATABASE_URL` | Sí | PostgreSQL / Neon |
| `JWT_SECRET` | Sí | Sesión admin |
| `ADMIN_EMAIL` | Seed | Admin inicial |
| `ADMIN_PASSWORD` | Seed | Admin inicial |
| `NEXT_PUBLIC_APP_URL` | Recomendada | URL pública del sitio |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Sí | Botones WhatsApp |
| `BLOB_READ_WRITE_TOKEN` | Upload | Imágenes admin (opcional: URL manual sin esto) |

### 2. Base de datos

```bash
npx prisma migrate deploy
npm run db:seed
```

En Vercel, el seed se ejecuta manualmente desde tu máquina apuntando a la DB de producción, o vía script one-off.

### 3. Vercel Blob (imágenes)

1. Dashboard Vercel → **Storage** → crear Blob Store.
2. Copiar `BLOB_READ_WRITE_TOKEN` → Environment Variables → Production.
3. Redeploy.

Sin token: el panel funciona con URLs manuales; upload muestra aviso claro.

### 4. Deploy

```bash
git push origin main
```

Vercel ejecuta `npm run build` automáticamente.

### 5. Verificar entorno y E2E

```bash
npm run verify:env          # variables sin mostrar secretos
npm run db:migrate          # prisma migrate deploy
npm run db:seed
npm run test:e2e https://tu-app.vercel.app
```

Guía completa: **[docs/DEPLOY_E2E.md](docs/DEPLOY_E2E.md)**

---

## Variables (.env.example)

```bash
DATABASE_URL=          # PostgreSQL / Neon
JWT_SECRET=            # Secreto largo para JWT admin
ADMIN_EMAIL=           # Email admin seed
ADMIN_PASSWORD=        # Password admin seed
NEXT_PUBLIC_APP_URL=   # http://localhost:3001 o dominio prod
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_WHATSAPP_MESSAGE=
BLOB_READ_WRITE_TOKEN= # Vercel Blob (upload imágenes)
```

---

## Arquitectura resumida

| Capa | Descripción |
|------|-------------|
| Web pública | Home motion, `/menu`, checkout, seguimiento `/pedido/[code]` |
| APIs públicas | `GET /api/public/products`, `categories`, `promos`, `settings`, `POST orders` |
| Admin | CRUD productos/categorías/promos/settings, pedidos, imágenes |
| Auth | Cookie `rusty_admin_session` httpOnly + JWT |
| Storage | Vercel Blob + tabla `ImageAsset` |

---

## Assets locales

Ver `public/rusty/ASSETS-README.md`. Placeholders:

```bash
npm run assets:placeholders
```

---

## Próximas mejoras (opcionales)

- Conectar botones WhatsApp a `settings` en runtime (sin depender solo de env)
- Conectar página `/promos` a API pública (sin rediseñar motion)
- Pagos online (Mercado Pago / Stripe)
