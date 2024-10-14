<script setup lang="ts">
import { ModalsContainer } from 'vue-final-modal'
</script>

<template>
  <BaseLayout>
    <template #page-header>
      <div class="layout-header">header</div>
    </template>
    <template #page-content>
      <NuxtPage />
      <ModalsContainer />
    </template>
    <template #page-footer>
      <div class="layout-footer">footer</div>
    </template>
  </BaseLayout>
</template>

<style scoped lang="scss">
.layout {
  &-header,
  &-footer {
    height: 10rem;
    border: 0.1rem solid;
  }
}
</style>
