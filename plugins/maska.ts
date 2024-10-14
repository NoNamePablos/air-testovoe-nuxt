import { vMaska } from 'maska'

export default defineNuxtPlugin((context) => {
  context.vueApp.directive('maska', vMaska)
})
