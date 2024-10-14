<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

defineOptions({
  name: 'RequestPopup'
})
</script>

<template>
  <VueFinalModal
    class="request-popup"
    content-class="request-popup-content"
    content-transition="vfm-fade"
    overlay-transition="vfm-fade"
  >
    <RequestForm />
  </VueFinalModal>
</template>

<style scoped lang="scss">
:global(.request-popup) {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
