/**
 * Migra clases legacy (hex, neutral-*, px arbitrarios) a tokens Uanabi.
 * Uso: node scripts/migrate-design-tokens.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const SRC = path.join(process.cwd(), 'src')

const REPLACEMENTS = [
  [/text-\[#111827\]/g, 'text-foreground'],
  [/text-\[#1d230d\]/g, 'text-match-foreground'],
  [/text-\[#374151\]/g, 'text-foreground/80'],
  [/text-\[#6b7280\]/g, 'text-muted-foreground'],
  [/text-\[#9ca3af\]/g, 'text-muted-foreground'],
  [/border-\[#eef0f2\]/g, 'border-border-subtle'],
  [/bg-\[#eef0f2\]/g, 'bg-border-subtle'],
  [/bg-\[#f9fafb\]/g, 'bg-secondary'],
  [/bg-\[#fbfbfc\]/g, 'bg-background'],
  [/bg-\[#f3f4f6\]/g, 'bg-secondary'],
  [/bg-\[#111827\]/g, 'bg-primary'],
  [/hover:bg-\[#1f2937\]/g, 'hover:bg-primary/90'],
  [/hover:bg-\[#f9fafb\]/g, 'hover:bg-secondary'],
  [/hover:text-\[#111827\]/g, 'hover:text-foreground'],
  [/text-neutral-900/g, 'text-foreground'],
  [/text-neutral-800/g, 'text-foreground'],
  [/text-neutral-700/g, 'text-foreground/80'],
  [/text-neutral-600/g, 'text-muted-foreground'],
  [/text-neutral-500/g, 'text-muted-foreground'],
  [/text-neutral-400/g, 'text-muted-foreground'],
  [/border-neutral-100/g, 'border-border-subtle'],
  [/border-neutral-200/g, 'border-border'],
  [/border-neutral-300/g, 'border-border'],
  [/bg-neutral-900/g, 'bg-primary'],
  [/bg-neutral-800/g, 'bg-primary/90'],
  [/bg-neutral-50/g, 'bg-secondary'],
  [/bg-neutral-100/g, 'bg-secondary'],
  [/hover:bg-neutral-50/g, 'hover:bg-secondary'],
  [/hover:bg-neutral-100/g, 'hover:bg-secondary'],
  [/hover:bg-neutral-800/g, 'hover:bg-primary/90'],
  [/hover:border-neutral-900/g, 'hover:border-primary'],
  [/focus:border-neutral-900/g, 'focus:border-primary'],
  [/text-\[10px\]/g, 'type-small'],
  [/text-\[9px\]/g, 'type-small'],
  [/text-\[11px\]/g, 'type-small'],
  [/text-\[13px\]/g, 'type-body'],
  [/text-\[15px\]/g, 'type-body'],
  [/text-\[0\.8rem\]/g, 'type-body'],
]

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    if (fs.statSync(full).isDirectory()) walk(full, files)
    else if (/\.(jsx|js|css)$/.test(name) && !name.includes('migrate-design')) files.push(full)
  }
  return files
}

let changed = 0
for (const file of walk(SRC)) {
  let content = fs.readFileSync(file, 'utf8')
  const orig = content
  for (const [re, rep] of REPLACEMENTS) {
    content = content.replace(re, rep)
  }
  if (content !== orig) {
    fs.writeFileSync(file, content)
    changed++
    console.log('updated:', path.relative(process.cwd(), file))
  }
}
console.log(`\n${changed} archivos actualizados.`)
