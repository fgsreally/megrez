import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite'
import UnoCSS from 'unocss/vite'
import Components from 'unplugin-vue-components/vite'
import transformerDirectives from '@unocss/transformer-directives'
import { presetAttributify, presetUno } from 'unocss'
import AutoImport from 'unplugin-auto-import/vite'
import ReactivityTransform from '@vue-macros/reactivity-transform/vite'
import PC from 'phecda-client/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import { ArcoResolver } from 'unplugin-vue-components/resolvers'
// import Merak from 'vite-plugin-merak'

// https://vitejs.dev/config/
export default defineConfig({

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3699',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    Icons({ compiler: 'vue3' }),
    // Inspect(),
    PC({
      localPath: '../backend/pmeta.js',
      port: ' http://localhost:3699/',

    }),
    VueMacros({
      setupBlock: true,
      plugins: {
        vue: Vue({
          reactivityTransform: true,

        }),
      },
    }),
    AutoImport({
      dirs: ['./src/**/*'],
      imports: ['vue', 'vue-router'],
      resolvers: [
        ArcoResolver({ sideEffect: true }),
      ],
    }),
    Components({
      dirs: ['./src/components', './src/views'],
      directoryAsNamespace: false,
      resolvers: [
        ArcoResolver({ sideEffect: true }),
        IconsResolver({

        })],

    }),
    ReactivityTransform(),
    UnoCSS({
      transformers: [
        transformerDirectives(),
      ],
      theme: {

      },
      presets: [
        presetAttributify(),
        presetUno(),
      ],
    })],
})
