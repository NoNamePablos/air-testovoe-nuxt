<script setup lang="ts">
import { useModal } from 'vue-final-modal'
import RequestPopup from '~/components/Request/Popup.vue'

const { open, close } = useModal({
  component: RequestPopup
})
</script>

<template>
  <div class="main-page">
    <BaseButton @click="open()">Open modal</BaseButton>
  </div>
</template>
