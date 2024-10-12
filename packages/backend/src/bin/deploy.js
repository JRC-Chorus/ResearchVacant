const { build } = require('esbuild');
const { GasPlugin } = require('esbuild-gas-plugin');

build({
  entryPoints: ['./src/main.ts'],
  bundle: true,
  minify: true,
  charset: 'utf8',
  outfile: '../../dist/Code.js',
  define: {
    'import.meta.vitest': 'undefined',
  },
  plugins: [GasPlugin],
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
