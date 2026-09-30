import { readFile } from 'node:fs/promises';
import path from 'node:path';

const dir = path.join(process.cwd(), 'src/app/_og');

/** Static instances of the Press type, for share cards rendered at build time. */
export async function ogFonts() {
  const load = (file: string) => readFile(path.join(dir, file));
  const [display, displayBold, serif, serifItalic] = await Promise.all([
    load('archivo-900-62.woff'),
    load('archivo-800-75.woff'),
    load('newsreader-400.woff'),
    load('newsreader-600-italic.woff'),
  ]);
  return [
    { name: 'Display', data: display, weight: 900 as const, style: 'normal' as const },
    { name: 'DisplayHead', data: displayBold, weight: 800 as const, style: 'normal' as const },
    { name: 'Serif', data: serif, weight: 400 as const, style: 'normal' as const },
    { name: 'Serif', data: serifItalic, weight: 600 as const, style: 'italic' as const },
  ];
}

export const OG = {
  paper: '#e3e5e3',
  ink: '#0d0d0c',
  muted: '#3f3e3a',
  pen: '#d7261e',
  hl: '#f2c200',
  size: { width: 1200, height: 630 },
};
