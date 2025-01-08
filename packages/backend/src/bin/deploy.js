const { build } = require('esbuild');
const { GasPlugin } = require('esbuild-gas-plugin');

const envs = require('dotenv').config({ path: './.env.local' });

// import.metaの値を定義
// 型定義は`backend/src/importMeta.d.ts`に記述
const define = {
  'import.meta.vitest': 'undefined',
};
Object.entries(envs.parsed).map(([k, v]) => {
  define[`import.meta.${k}`] = JSON.stringify(v);
});

build({
  entryPoints: ['./src/main.ts'],
  bundle: true,
  minify: true,
  charset: 'utf8',
  outfile: '../../dist/Code.js',
  define,
  plugins: [GasPlugin],
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
