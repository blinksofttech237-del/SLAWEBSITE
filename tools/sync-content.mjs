#!/usr/bin/env node
/**
 * Copies the shared content seed into the Angular source tree.
 * The backend reads /content/seed.json directly; the frontend imports a typed
 * copy so that it can render instantly and remain resilient if the API is slow
 * or temporarily unavailable.
 *
 * Usage: node tools/sync-content.mjs
 */
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(ROOT, 'content/seed.json');
const targetDir = join(ROOT, 'frontend/src/app/core/data');
const target = join(targetDir, 'demo-content.json');

mkdirSync(targetDir, { recursive: true });
copyFileSync(source, target);
console.log('✓ content/seed.json → frontend/src/app/core/data/demo-content.json');
