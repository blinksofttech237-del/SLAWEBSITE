#!/usr/bin/env node
/**
 * SELECTA EMPIRE LIMITED — Brand asset generator
 * Generates every SVG lockup from a single geometric definition so that the
 * SLA monogram stays perfectly consistent across all declinations.
 *
 * Usage: node tools/generate-brand.mjs
 * Output: frontend/public/brand/*.svg
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'frontend/public/brand');
mkdirSync(OUT, { recursive: true });

const LETTERS = `
    <path d="M58 38H30v30h28v33H30"/>
    <path d="M72 38v63h26"/>
    <path d="M104 101 116.5 46"/>
    <path d="M130 101 117.5 46"/>
    <path d="M107 82h18" stroke-width="9"/>`;

const brackets = (color, opacity = 1) => `
  <g stroke="${color}" stroke-width="2" fill="none" opacity="${opacity}">
    <path d="M8 24V8h16"/>
    <path d="M116 8h16v16"/>
    <path d="M132 116v16h-16"/>
    <path d="M24 132H8v-16"/>
  </g>`;

function symbol({ ink, accent, showBrackets = true, bg = null, radius = 0 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" role="img" aria-labelledby="t">
  <title id="t">SELECTA EMPIRE — monogramme SLA</title>
  ${bg ? `<rect width="140" height="140" rx="${radius}" fill="${bg}"/>` : ''}
  <g fill="none" stroke="${ink}" stroke-width="11" stroke-linecap="square" stroke-linejoin="miter">${LETTERS}
  </g>${showBrackets ? brackets(accent) : ''}
</svg>
`;
}

function badge({ bg, ink, accent, radius = 32 }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" role="img" aria-labelledby="t">
  <title id="t">SELECTA EMPIRE — insigne SLA</title>
  <rect width="140" height="140" rx="${radius}" fill="${bg}"/>
  <g transform="translate(19.6 19.6) scale(0.72)" fill="none" stroke="${ink}" stroke-width="11" stroke-linecap="square" stroke-linejoin="miter">${LETTERS}
  </g>${brackets(accent, 0.85)}
</svg>
`;
}

function lockup({ ink, sub, tile = '#050505', letter = '#F4F1E9', accent = '#5B8FD6', onDark = false }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 140" role="img" aria-labelledby="t">
  <title id="t">SELECTA EMPIRE LIMITED</title>
  <rect width="140" height="140" rx="32" fill="${tile}"/>
  <g transform="translate(19.6 19.6) scale(0.72)" fill="none" stroke="${letter}" stroke-width="11" stroke-linecap="square" stroke-linejoin="miter">${LETTERS}
  </g>${brackets(accent, 0.85)}
  <g font-family="Sora, Inter, Helvetica, Arial, sans-serif" fill="${ink}">
    <text x="166" y="72" font-size="33" font-weight="700" letter-spacing="0.6">SELECTA EMPIRE</text>
    <text x="168" y="101" font-size="14" font-weight="600" letter-spacing="8.5" fill="${sub}">LIMITED</text>
    <rect x="168" y="113" width="56" height="3" fill="#2457A6"/>
  </g>
</svg>
`;
}

const files = {
  // Monogrammes (symbole seul)
  'sla-symbol.svg': symbol({ ink: '#050505', accent: '#2457A6' }),
  'sla-symbol-inverse.svg': symbol({ ink: '#F4F1E9', accent: '#5B8FD6' }),
  'sla-symbol-blue.svg': symbol({ ink: '#2457A6', accent: '#050505' }),
  'sla-symbol-mono-black.svg': symbol({ ink: '#050505', accent: '#050505', showBrackets: false }),
  'sla-symbol-mono-white.svg': symbol({ ink: '#F4F1E9', accent: '#F4F1E9', showBrackets: false }),

  // Insignes (symbole sur tuile)
  'sla-badge.svg': badge({ bg: '#050505', ink: '#F4F1E9', accent: '#5B8FD6' }),
  'sla-badge-blue.svg': badge({ bg: '#2457A6', ink: '#F4F1E9', accent: '#F4F1E9' }),
  'sla-badge-light.svg': badge({ bg: '#F4F1E9', ink: '#050505', accent: '#2457A6' }),

  // Logos principaux
  'sla-logo-primary.svg': lockup({ ink: '#050505', sub: '#2457A6' }),
  'sla-logo-inverse.svg': lockup({ ink: '#F4F1E9', sub: '#8FB3E8', tile: '#F4F1E9', letter: '#050505', accent: '#2457A6' }),
  'sla-logo-blue.svg': lockup({ ink: '#2457A6', sub: '#2457A6', tile: '#2457A6', letter: '#F4F1E9', accent: '#F4F1E9' }),

  // Favicon (carré, lisible en 16px)
  'favicon.svg': badge({ bg: '#050505', ink: '#F4F1E9', accent: '#2457A6', radius: 20 }),
};

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(OUT, name), svg);
  console.log('✓', name);
}
console.log(`\n${Object.keys(files).length} brand assets written to frontend/public/brand/`);
