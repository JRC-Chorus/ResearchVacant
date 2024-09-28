const { build } = require('esbuild');
const { GasPlugin } = require('esbuild-gas-plugin');

build({
  entryPoints: ['./src/main.ts'],
  bundle: true,
  minify: true,
  outfile: '../../dist/Code.js',
  plugins: [GasPlugin],
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
