# GUÍA DE MIGRACIÓN — Lovable AstroKids → crystal-cosmos
## Tiempo estimado: 30-45 minutos

### PASO 1 — Copiar archivos desde Lovable export

```
Lovable: src/components/astrokids/*
→ crystal-cosmos: src/app/astrologia-para-ninos/components/

Lovable: src/lib/astrokids-data.ts
→ crystal-cosmos: src/lib/astrokids/astrokids-data.ts

Lovable: src/components/ui/* (shadcn components usados)
→ crystal-cosmos: src/components/ui/ (si no existen ya)
```

### PASO 2 — Adaptar imports en cada componente

ANTES (Lovable/Vite):
```tsx
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
```

DESPUÉS (Next.js):
```tsx
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
```

### PASO 3 — Conectar en AstroKidsClient.tsx

```tsx
'use client'
// Importar todos los componentes de Lovable aquí
import { HeroAstroKids } from './LandingHero'
import { SignSelector } from './SignSelector'
// etc.
```

### PASO 4 — Tokens CSS

Copiar variables CSS de Lovable index.css → globals.css en la sección:
```css
/* AstroKids tokens */
--astrokids-primary: ...
--astrokids-cosmic: ...
```

### PASO 5 — Verificar rutas

| Lovable route | Next.js route |
|---|---|
| `/` (landing) | `/astrologia-para-ninos` |
| `/calculadora` | `/astrologia-para-ninos/calculadora` |
| `/perfil/:signo` | `/astrologia-para-ninos/perfil/[signo]` |
| `/familia` | `/astrologia-para-ninos/familia` |
| `/diario` | `/astrologia-para-ninos/diario` |

### PASO 6 — Build check

```bash
npm run build
# Debe pasar 0 errores TypeScript
```
