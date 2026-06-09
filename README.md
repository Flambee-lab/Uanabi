# Uanabi

Plataforma que conecta marcas (sponsors) con hosts de eventos. El MVP actual es la **app Host**: explorar marcas, gestionar eventos e invitar sponsors.

**Base de conocimiento del producto (todo el equipo):** [`docs/PRODUCT.md`](docs/PRODUCT.md)

## Stack

- React 19 + Vite 8
- Tailwind CSS v4
- Lucide icons

## Desarrollo local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Salida en `dist/`.

## Deploy en Vercel

Conectar el repo `Flambee-lab/Uanabi`. Vercel detecta Vite automáticamente (`vercel.json` incluido).

- **Build command:** `npm run build`
- **Output directory:** `dist`
