/**
 * Auditoría de tipografía en src/
 * Uso: npm run audit:typography
 *
 * Lista tamaños Tailwind y valores arbitrarios (text-[Npx]) para detectar saltos.
 */
import fs from 'node:fs'
import path from 'node:path'

const SRC = path.join(process.cwd(), 'src')
const EXT = /\.(jsx|js|tsx|ts|css)$/

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) walk(full, files)
    else if (EXT.test(name)) files.push(full)
  }
  return files
}

const tailwindSizes = new Map()
const arbitrary = new Map()
const fontDisplay = { count: 0, files: new Set() }

const twRe = /\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)\b/g
const arbRe = /\btext-\[([^\]]+)\]/g
const displayRe = /\bfont-display\b/g

for (const file of walk(SRC)) {
  const rel = path.relative(process.cwd(), file)
  const content = fs.readFileSync(file, 'utf8')

  for (const m of content.matchAll(twRe)) {
    const key = m[1]
    if (!tailwindSizes.has(key)) tailwindSizes.set(key, { count: 0, files: new Set() })
    const e = tailwindSizes.get(key)
    e.count++
    e.files.add(rel)
  }

  for (const m of content.matchAll(arbRe)) {
    const key = m[1]
    if (!arbitrary.has(key)) arbitrary.set(key, { count: 0, files: new Set() })
    const e = arbitrary.get(key)
    e.count++
    e.files.add(rel)
  }

  if (displayRe.test(content)) {
    const n = (content.match(displayRe) || []).length
    fontDisplay.count += n
    fontDisplay.files.add(rel)
  }
}

const pxOrder = (a, b) => {
  const na = parseFloat(a)
  const nb = parseFloat(b)
  if (!Number.isNaN(na) && !Number.isNaN(nb)) return na - nb
  return a.localeCompare(b)
}

console.log('\n=== Uanabi — Auditoría tipográfica ===\n')
console.log('Escala objetivo: type-display 28px · type-heading 18px · type-body 14px · type-small 12px\n')

console.log('--- Tailwind text-* (conteo) ---')
const twPx = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 }
for (const [size, data] of [...tailwindSizes.entries()].sort((a, b) => (twPx[a[0]] ?? 99) - (twPx[b[0]] ?? 99))) {
  const approx = twPx[size] ? `~${twPx[size]}px` : '?'
  console.log(`  text-${size.padEnd(5)} ${String(data.count).padStart(4)}  ${approx}`)
}

console.log('\n--- Tamaños arbitrarios text-[...] (revisar) ---')
if (arbitrary.size === 0) {
  console.log('  (ninguno)')
} else {
  for (const [val, data] of [...arbitrary.entries()].sort((a, b) => pxOrder(a[0], b[0]))) {
    console.log(`  text-[${val}]  ×${data.count}`)
  }
}

console.log(`\n--- font-display: ${fontDisplay.count} usos en ${fontDisplay.files.size} archivos ---`)
console.log('\nTip: reemplazá arbitrarios por .type-display | .type-heading | .type-body | .type-small | .type-label\n')
