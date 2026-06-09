# Uanabi — Base de conocimiento del producto

Documento de referencia para todo el equipo (Guillermo, Mile, y futuros devs).  
**Fuente de verdad compartida** entre ramas: si algo cambia en el producto, actualizar este archivo.

Última actualización: 2026-06-04.

---

## Qué es Uanabi

Uanabi es una plataforma que **conecta marcas (sponsors) con hosts de eventos**.

Un **host** es cualquier persona u organización que organice un evento — presencial u online. Desde la plataforma, el host **le pide producto** (u otros aportes) a las marcas. La marca puede pedir a cambio **publicación en redes**, exposición en el evento, o **a veces nada**.

**Alcance geográfico inicial:** solo **CABA** (Capital Federal).

Hoy el MVP en desarrollo cubre principalmente la **experiencia del host**. El resto de superficies están planificadas o en etapa manual.

---

## Actores

| Actor | Descripción | Alta / acceso | Estado en producto |
|-------|-------------|---------------|-------------------|
| **Host** | Organiza eventos y solicita patrocinio/producto a marcas | **Signup propio** en la plataforma | **En desarrollo** — app principal actual |
| **Marca (sponsor)** | Recibe solicitudes, define qué ofrece y qué pide a cambio | **Solo vía Uanabi** — el equipo da de alta y verifica marcas reales. Puede existir un “claim de marca” futuro, pero siempre con reunión con el equipo | **Planificado** — panel propio |
| **Admin Uanabi** | Gestiona perfiles de marcas y logística de productos | Equipo interno | **Manual hoy** — panel admin planificado |
| **Visitante** | Conoce la plataforma desde la landing | Puede explorar en landing **sin cuenta**; en la **plataforma logueada, no** | **Planificado** — landing al final del roadmap |

**Solicitud de ingreso como marca:** se podría permitir que una marca **pida entrar**, pero **siempre la evalúa el equipo** — nunca es self-service completo.

---

## Superficies de producto (4 + link de marca)

### Orden de desarrollo (roadmap)

1. **App Host** ← ahora
2. **Panel Marca**
3. **Panel Admin**
4. **Landing page**

### 1. App Host (actual)

Flujos principales:

- Explorar marcas y filtrar por rubro/ubicación (CABA)
- Ver perfil público de marca
- Crear y gestionar eventos (estilo Luma)
- Enviar propuestas / solicitudes de patrocinio a marcas
- Seguimiento de invitaciones y estados de patrocinio
- Perfil público del host, onboarding, configuración

**Acceso:** requiere cuenta de host (sin modo invitado dentro de la app — ver decisión de acceso).

**Stack actual:** React 19, Vite, Tailwind v4, Supabase (auth + perfiles en wiring; datos de negocio aún en demo).

### 2. Panel Marca (siguiente)

Las marcas ya tienen cuenta creada por Uanabi. Desde su panel:

- Recibir y gestionar solicitudes de hosts
- Responder: **En espera → Aprobado / Rechazado**
- Contraofertas posibles en producto futuro; **hoy se manejan offline** (“Apruebo, pero con estas condiciones” → equipo Uanabi media)

### 3. Panel Admin (después)

Equipo Uanabi:

- Alta y verificación de perfiles de marcas
- **Logística de productos** — objetivo: **Uanabi envía** (warehouse propio o gestión centralizada)
- Operaciones que hoy son **manuales** (WhatsApp, coordinación con host)

### 4. Landing page (última en roadmap)

- Explicar qué hace Uanabi
- **Signup solo para hosts**
- Exploración sin cuenta permitida **solo en landing**, no dentro de la app

### 5. Link personal por marca

Cada marca tendrá un **link propio**. Lo usan **todos** (no solo hosts ya registrados).

**Flujo del link:**

```
Usuario entra al link de la marca
    → “¿Tenés un evento para proponernos? ¡Contanos!”
    → Completa características del evento / propuesta
    → Signup en Uanabi (como host)
    → La solicitud llega a la marca (ya tiene cuenta con Uanabi)
```

---

## Flujo de negocio

### Flujo principal (host en plataforma)

```
Host crea evento
    → Host explora marcas / envía propuesta
        → Marca recibe solicitud
            → Estado: En espera → Aprobado ó Rechazado
                → Si Aprobado: Uanabi coordina entrega vía WhatsApp con el host (hoy)
                    → Evento con producto/patrocinio acordado
```

### Pipeline de estados (oficial por ahora)

| Estado | Significado |
|--------|-------------|
| **En espera** | Solicitud enviada; marca aún no resolvió |
| **Aprobado** | Marca aceptó; pasa a coordinación logística |
| **Rechazado** | Marca no avanza con la propuesta |

> El MVP puede tener estados adicionales en UI/mock por razones de demo. **No cambiar la plataforma** solo por este doc — es contexto para entender el producto.

### Negociación y logística (operación actual)

- **Contraoferta:** la marca puede decir “Apruebo con estas condiciones” — **offline**, mediado por el equipo Uanabi.
- **Entrega:** si la marca da OK, **Uanabi gestiona por WhatsApp** con el host para coordinar la entrega.
- **Visión:** Uanabi quiere **resolver el envío ellos mismos** (warehouse o logística propia), no depender de que cada marca envíe directo.

### Tipos de aporte

Producto físico, presupuesto, activaciones, naming rights, contenido co-branded, etc. (según perfil de cada marca).

### Contraprestación típica

Posts en redes, menciones, presencia en el evento — o **ninguna** en algunos casos.

---

## Modelo de negocio

| Fase | Modelo |
|------|--------|
| **Lanzamiento** | Marcas con **1 año gratis** — prioridad: conseguir volumen de marcas |
| **Después** | **Fee anual** para marcas |

Hosts: sin detalle de monetización definido en esta conversación.

---

## Alta de marcas

- **Siempre las da de alta el equipo Uanabi** — hay que verificar que son marcas reales.
- Una marca **no se registra sola** como un host.
- Futuro posible: **claim de marca** (“esta soy yo”), pero **obligatorio reunirse con Uanabi** antes de activar.
- Futuro posible: formulario de **solicitud de ingreso**, siempre con **evaluación del equipo**.

---

## Acceso y autenticación

| Contexto | ¿Sin cuenta? |
|----------|--------------|
| **Landing** | Sí — puede explorar / conocer el producto |
| **Plataforma (app host)** | No — requiere signup/login de host |
| **Panel marca** | Cuenta creada por Uanabi |
| **Signup abierto** | **Solo hosts** por ahora |

---

## Estado actual del código (MVP Host)

| Área | Estado |
|------|--------|
| Auth (email, Google, Supabase) | Implementado (wiring) |
| Onboarding host | Implementado |
| Home Marcas + búsqueda | Implementado |
| Perfil público de marca | Implementado |
| Mis Eventos + dashboard de patrocinio | Implementado |
| Propuestas / invitaciones / estados | Implementado (**mock + lógica local**) |
| Modo invitado en plataforma | Parcial en código — **destino de producto: no invitado en app** |
| Panel marca | No iniciado (**siguiente**) |
| Panel admin | No iniciado |
| Landing marketing | No iniciado (**última**) |
| Link personal de marca | No iniciado |
| Logística automatizada | No — WhatsApp + operación manual |
| **Supabase datos de negocio** | **Nada en prod aún — todo demo** |

**Datos:** mocks en `src/data/`. Supabase preparado para auth/perfiles de host; sin fuente de verdad de negocio en producción.

**Deploy:** Vercel (`Flambee-lab/Uanabi`).

---

## Terminología

| Término | Significado |
|---------|-------------|
| **Uanabi** | Nombre de la plataforma |
| **Host** | Organizador de eventos — usuario del signup abierto |
| **Marca / Sponsor** | Empresa que patrocina o aporta producto |
| **Marcas** (copy UI actual) | Cómo referimos a sponsors en la app por ahora — **nombre final de marca en catálogo aún no definido** |
| **Propuesta / solicitud** | Pedido del host a una marca para un evento |
| **Invitación** | Relación evento ↔ marca con ciclo de vida |
| **Producto** | Lo que la marca aporta (stock, kits, presupuesto, etc.) |

---

## Equipo y ramas

- Repo: `Flambee-lab/Uanabi`
- Integración principal en **`main`**
- Guillermo: producto host, Mis Eventos, exploración de marcas
- Mile: diseño, auth, onboarding, perfil público (integrado en `main`)
- Flujo Git: ver `.cursor/rules/git-workflow-guillermo.mdc`

---

## Preguntas aún abiertas

- [ ] **Nombre final** del concepto “marca en catálogo” (hoy: “marcas” en UI)
- [ ] **Tipos de evento excluidos** (tamaño mínimo, rubros prohibidos, etc.)
- [ ] **Contratos / términos** legales entre host, marca y Uanabi
- [ ] **Fee anual** — monto y condiciones post año gratis
- [ ] **Detalle del warehouse / logística propia** — cuándo y cómo

---

## Cómo mantener este documento

1. Antes de diseñar una feature nueva, leer este archivo.
2. Cuando se tome una decisión de producto, actualizar la sección correspondiente.
3. En PRs relevantes, mencionar si hay que actualizar `docs/PRODUCT.md`.
4. Los agentes de Cursor cargan un resumen vía `.cursor/rules/product-context.mdc`.

---

## Changelog

| Fecha | Autor | Cambio |
|-------|-------|--------|
| 2026-06-04 | Guillermo + Cursor | Creación inicial |
| 2026-06-04 | Guillermo + Cursor | Respuestas de producto: CABA, flujos, pipeline, acceso, negocio, roadmap |
