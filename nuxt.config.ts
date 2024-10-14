import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  app: {
    pageTransition: { name: 'page' },
    layoutTransition: { name: 'layout' }
  },
  alias: {
    '@img': fileURLToPath(new URL('./assets/images', import.meta.url)),
    '@icons': fileURLToPath(new URL('./assets/icons', import.meta.url)),
    '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
    '@store': fileURLToPath(new URL('./store', import.meta.url)),
    '@utils': fileURLToPath(new URL('./utils', import.meta.url))
  },
  modules: ['@nuxtjs/eslint-module', '@vue-final-modal/nuxt', '@nuxtjs/i18n', ['@pinia/nuxt', { disableVuex: false }]],
  css: ['vue-final-modal/style.css', '@/assets/styles/index.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/assets/styles/global/colors.scss";
            @import "@/assets/styles/global/vars.scss";
            @import "@/assets/styles/global/mixins.scss";
            @import "@/assets/styles/global/text-styles.scss";
          `
        }
      }
    }
  },
  i18n: {
    locales: [
      { code: 'en', name: 'English', language: 'en-US', file: 'en.ts' },
      { code: 'ru', name: 'Russian', language: 'ru-RU', file: 'ru.ts' }
    ],
    langDir: 'locales',
    lazy: true,
    defaultLocale: 'ru'
  },
  runtimeConfig: {
    public: {
      baseApiUrl: process.env.API_BASE_URL,
      baseFullUrl: process.env.BASE_FULL_URL,
      nodeEnv: process.env.APP_NODE_ENV,
      isProduction: process.env.APP_NODE_ENV === 'production',
      apiDadataKey: process.env.NUXT_API_DADATA_KEY || 'key'
    }
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
  }
})
