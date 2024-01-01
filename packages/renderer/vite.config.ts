import { join } from 'path';
import { builtinModules } from 'module';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import optimizer from 'vite-plugin-optimizer';
import pkg from '../../package.json';

/**
 * For usage of Electron and NodeJS APIs in the Renderer process
 * @see https://github.com/caoxiemeihao/electron-vue-vite/issues/52
 */
export function resolveElectron(entries: Parameters<typeof optimizer>[0] = {}): Plugin {
  const builtins = builtinModules.filter((t) => !t.startsWith('_'));

  function builtinModulesExport(modules: string[]) {
    return modules
      .map((moduleId) => {
        const nodeModule = require(moduleId);
        const requireModule = `const M = require("${moduleId}");`;
        const exportDefault = 'export default M;';
        const exportMembers = `${Object.keys(nodeModule)
          .map((attr) => `export const ${attr} = M.${attr}`)
          .join(';\n')};`;
        const nodeModuleCode = `
${requireModule}

${exportDefault}

${exportMembers}
`;

        return { [moduleId]: nodeModuleCode };
      })
      .reduce((memo, item) => Object.assign(memo, item), {});
  }

  function electronExport() {
    return `
/**
 * For all exported modules see https://www.electronjs.org/docs/latest/api/clipboard -> Renderer Process Modules
 */
const electron = require("electron");
const {
  clipboard,
  nativeImage,
  shell,
  contextBridge,
  crashReporter,
  ipcRenderer,
  webFrame,
  desktopCapturer,
  deprecate,
} = electron;

export {
  electron as default,
  clipboard,
  nativeImage,
  shell,
  contextBridge,
  crashReporter,
  ipcRenderer,
  webFrame,
  desktopCapturer,
  deprecate,
}
`;
  }

  /**
   * @see https://github.com/caoxiemeihao/vite-plugins/tree/main/packages/resolve#readme
   */
  return optimizer({
    electron: electronExport(),
    ...builtinModulesExport(builtins),
    ...entries,
  });
}

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  mode: process.env.NODE_ENV,
  root: __dirname,
  plugins: [
    react(),
    resolveElectron({
      'electron-store': 'const Store = require("electron-store"); export default Store;',
      'cos-nodejs-sdk-v5': 'const Cos = require("cos-nodejs-sdk-v5"); export default Cos;',
      sharp: 'const Sharp = require("sharp"); export default Sharp;',
    }),
  ],
  base: './',
  build: {
    sourcemap: true,
    outDir: '../../dist/renderer',
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },
});
