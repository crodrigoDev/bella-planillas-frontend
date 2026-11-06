import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const PALETA =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
const USOS =
  'bg|text|border|ring|outline|fill|stroke|from|via|to|divide|decoration|shadow|accent|caret'
// Clases como `bg-red-500` o `text-emerald-700`, y `bg-white` o `text-black`
const COLOR_FIJO = String.raw`\b(?:${USOS})(?:-[xytblrse])?-(?:(?:${PALETA})-\d{2,3}|white|black)\b`
const MENSAJE_COLOR_FIJO =
  'No uses colores fijos de Tailwind: usa los tokens del tema (bg-success-soft, text-destructive, StatusBadge...). Ver docs/README.md.'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    // Los colores salen de los tokens de index.css (success, warning, destructive...),
    // nunca de la paleta de Tailwind: así el tema se cambia en un solo lugar
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/ui/**'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=/${COLOR_FIJO}/]`,
          message: MENSAJE_COLOR_FIJO,
        },
        {
          selector: `TemplateElement[value.raw=/${COLOR_FIJO}/]`,
          message: MENSAJE_COLOR_FIJO,
        },
      ],
    },
  },
  {
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
