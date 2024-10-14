<script lang="ts" setup>
import { Icon } from '@/types'

interface Props extends Icon.Base {
  chevron?: Icon.Directions
  size?: 'small' | 'large' | 'auto'
}

withDefaults(defineProps<Props>(), {
  isSvg: true,
  filled: true,
  chevron: Icon.Directions.DOWN,
  size: 'small'
})
</script>

<template>
  <div :class="`chevron chevron--${chevron} chevron-size--${size}`">
    <BaseIcon :name="Icon.Models.CHEVRON" :is-svg="isSvg" :filled="filled" />
  </div>
</template>

<style lang="scss" scoped>
.chevron {
  &-size {
    &--small {
      width: 2rem;
      height: 2rem;
    }
  }

  &--left {
    transform: rotate(90deg);
  }

  &--right {
    transform: rotate(-90deg);
  }

  &--up {
    transform: rotate(180deg);
  }
}
</style>
