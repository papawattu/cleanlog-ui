import litHtml from 'rollup-plugin-lit-html'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import { copy } from '@web/rollup-plugin-copy'
import dotenv from 'dotenv'
dotenv.config()

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/main.js',
  output: {
    dir: 'pb_public',
    format: 'esm', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: true,
  },
  watch: {
    clearScreen: false,
    chokidar: {
      usePolling: true,
    },
    include: 'src/**',
  },
  plugins: [
    litHtml({ include: './view/**/*.html' }),
    nodeResolve(),
    production ? terser() : {},
    replace({
      'process.env.NODE_ENV': process.env.NODE_ENV,
      //'process.env.POCKETBASE_API_URL': process.env.POCKETBASE_API_URL,
      preventAssignment: true,
    }),
    copy({
      patterns: '**/*.{html,css,png}',
      rootDir: 'public',
    }),
  ],
}
