// Bundles src/ (React) into dist/index.html (JS + CSS inlined). GSAP + ScrollTrigger load from cdnjs.
import { build, transform } from 'esbuild';
import fs from 'node:fs';

const js = await build({
  entryPoints: ['src/main.jsx'], bundle: true, minify: true, write: false,
  format: 'iife', jsx: 'automatic', target: ['es2020'],
  define: { 'process.env.NODE_ENV': '"production"' }, legalComments: 'none',
});
const css = (await transform(fs.readFileSync('src/styles.css', 'utf8'), { loader: 'css', minify: true })).code;
const tpl = fs.readFileSync('index.template.html', 'utf8');
fs.mkdirSync('dist', { recursive: true });
fs.cpSync('public/img', 'dist/img', { recursive: true });
const html = tpl.replace('/*CSS*/', () => css).replace('/*JS*/', () => js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script'));
fs.writeFileSync('dist/index.html', html);
console.log('built dist/index.html', (html.length / 1024).toFixed(0) + ' KB');
