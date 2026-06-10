# Uanabi — Deploy y Vercel

Referencia para todo el equipo. Última actualización: 2026-06-09.

---

## URLs

| Qué | Link |
|-----|------|
| **App en producción** | https://uanabi.vercel.app |
| **Dashboard Vercel** | https://vercel.com/guilletorri-gmailcoms-projects/uanabi |
| **Repositorio GitHub** | https://github.com/Flambee-lab/Uanabi |

---

## Proyecto Vercel (correcto)

| Campo | Valor |
|-------|--------|
| **Team / cuenta** | Proyectos Propios Guille (`guilletorri-gmailcoms-projects`) |
| **Nombre del proyecto** | `uanabi` |
| **Project ID** | `prj_emAIirmGNR2l8gds4LJmsy5OzLvN` |
| **Repo conectado** | `Flambee-lab/Uanabi` |
| **Rama de producción** | `main` |

> Si existía otro proyecto Vercel apuntando al mismo repo, **desconectarlo** en su dashboard (Settings → Git → Disconnect) para evitar deploys duplicados.

---

## Build

Configuración en `vercel.json` y detección automática de Vite:

| Setting | Valor |
|---------|--------|
| **Framework** | Vite |
| **Build command** | `npm run build` |
| **Output directory** | `dist` |
| **SPA** | Rewrite `/(.*)` → `/index.html` |

---

## Deploy automático

Cada **push a `main`** en GitHub dispara un deploy de producción en Vercel.

No hace falta deploy manual salvo pruebas puntuales.

---

## Desarrollo local vs Vercel

| Entorno | Comando / URL |
|---------|----------------|
| **Local** | `npm run dev` → http://localhost:5173 |
| **Build local** | `npm run build` → salida en `dist/` |
| **Deploy manual** | `npx vercel deploy --prod` (requiere `vercel login`) |

---

## Vincular el repo local (nuevo dev)

La carpeta `.vercel/` **no se commitea** (está en `.gitignore`). Cada dev puede regenerarla:

```bash
npx vercel login
npx vercel link
# Elegir team: Proyectos Propios Guille
# Elegir proyecto: uanabi
```

---

## Variables de entorno

En Vercel Dashboard → **Settings → Environment Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Plantilla local: `.env.example` → copiar a `.env.local`.

En Supabase → Authentication → URL Configuration, incluir la URL de producción:

- **Site URL:** `https://uanabi.vercel.app`
- **Redirect URLs:** `https://uanabi.vercel.app/auth/callback` (y `http://localhost:5173/auth/callback` para dev)

---

## Changelog

| Fecha | Cambio |
|-------|--------|
| 2026-06-09 | Reconexión del repo a `guilletorri-gmailcoms-projects/uanabi`; producción en `uanabi.vercel.app` |
