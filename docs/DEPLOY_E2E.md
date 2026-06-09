# Deploy producción + E2E — Fase 14I

Guía paso a paso para dejar RustyBurger en Vercel con prueba real.

---

## Prerrequisitos

- Cuenta [Vercel](https://vercel.com)
- Base PostgreSQL ([Neon](https://neon.tech) recomendado)
- Repo en GitHub/GitLab (o `vercel link` local)

---

## 1. Variables en Vercel (Production)

En **Project → Settings → Environment Variables**:

| Variable | Obligatoria | Notas |
|----------|-------------|-------|
| `DATABASE_URL` | Sí | Connection string Neon con `?sslmode=require` |
| `JWT_SECRET` | Sí | String largo aleatorio (32+ chars) |
| `ADMIN_EMAIL` | Sí | Email del dueño |
| `ADMIN_PASSWORD` | Sí | Password fuerte (solo para seed inicial) |
| `NEXT_PUBLIC_APP_URL` | Sí | `https://tu-dominio.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Sí | Sin `+`, ej. `5547984062460` |
| `BLOB_READ_WRITE_TOKEN` | Upload | Crear Blob Store en Vercel Storage |

> No commitear `.env.local` al repo.

---

## 2. Migración y seed (una vez)

Desde tu máquina, con `.env.local` apuntando a la **misma** `DATABASE_URL` de producción:

```bash
cp .env.example .env.local
# Completar todas las variables

node scripts/verify-env.mjs
npx prisma migrate deploy
npm run db:seed
```

---

## 3. Deploy

```bash
# Opción A: Git
git remote add origin <tu-repo>
git push -u origin main

# Opción B: Vercel CLI
npm i -g vercel
vercel --prod
```

Esperá que el build termine OK en el dashboard de Vercel.

---

## 4. E2E automático

Con la app desplegada (o `npm run dev` local con DB real):

```bash
node scripts/verify-env.mjs
node scripts/e2e-production.mjs https://tu-app.vercel.app
```

El script prueba:

- Páginas `/`, `/menu`, `/checkout`
- APIs públicas
- Creación de pedido real
- Validación delivery sin dirección
- Seguimiento `/pedido/[code]`
- Login admin + cambio de estado
- Upload (si Blob configurado en el servidor)

Al final imprime el **código de pedido de prueba** (ej. `RB-000002`).

---

## 5. E2E manual (checklist dueño)

- [ ] Abrir `/menu` → agregar al carrito → `/checkout` → confirmar
- [ ] Ver `/pedido/RB-XXXXXX` y recargar
- [ ] `/admin/login` → dashboard → pedidos → cambiar estado
- [ ] Recargar seguimiento público → nuevo estado visible
- [ ] Crear producto + imagen → ver en `/menu`
- [ ] `/admin/imagenes` → subir JPG &lt; 5 MB

---

## 6. Si algo falla

| Error | Solución |
|-------|----------|
| APIs 503 | `DATABASE_URL` en Vercel + redeploy |
| Login 500 JWT | `JWT_SECRET` en Vercel |
| Upload 503 | `BLOB_READ_WRITE_TOKEN` en Vercel |
| Admin sin usuario | `npm run db:seed` con `ADMIN_EMAIL/PASSWORD` |
| Build falla | `npm run build` local y corregir antes de push |
