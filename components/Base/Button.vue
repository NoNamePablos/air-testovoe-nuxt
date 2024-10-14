<script lang="ts" setup>
import { Button } from '@/types'

const props = withDefaults(defineProps<Button.Model>(), {
  type: Button.Types.BUTTON,
  disabled: false,
  theme: Button.Themes.BRAND,
  isLoading: false,
  outlined: false,
  isError: false,
  text: '',
  url: '',
  isAdaptive: false
})

const emit = defineEmits<Button.Emits>()

const themeClasses: Record<Button.Themes, string> = {
  [Button.Themes.BRAND]: 'base-button--brand',
  [Button.Themes.ERROR]: 'base-button--error'
} as const

const themeClass = computed<string>(() => themeClasses[props.theme])

const buttonClasses = computed((): (string | { [key: string]: boolean })[] => {
  return [themeClass.value, { 'base-button--error': props.isError }]
})

const button = ref<HTMLElement | null>(null)
const onClick = () => {
  if (button.value?.blur) {
    button.value.blur()
  }

  emit('click')
}
</script>

<template>
  <button
    ref="button"
    class="base-button text--button"
    :class="buttonClasses"
    :disabled="disabled || isLoading"
    :type="type"
    @click="onClick"
  >
    <slot>
      <span v-text="text" />
    </slot>
  </button>
</template>

<style lang="scss" scoped>
$brand_main: $BRAND_MAIN;
$brand_light: rgba($BRAND_MAIN, 0.7);
$gray_dark: $GRAY;
$white: $BASE_WHITE;
$red: $SYSTEM_ERROR;
$transition_fast: $TRANSITION_FAST;

@mixin background-button(
  $background: $brand_main,
  $color: $white,
  $hover_background: $brand_light,
  $hover_color: $white
) {
  &:not([disabled]) {
    background-color: $brand_main;
    color: $white;

    @include hover {
      &:hover {
        background-color: $brand_light;
        color: $white;
      }
    }

    &:active,
    &:focus {
      background-color: $brand_light;
      color: $white;
    }
  }
}

.base-button {
  position: relative;
  display: flex;
  overflow: hidden;
  width: max-content;
  align-items: center;
  border: 0.2rem solid transparent;
  padding: 1.2rem 4rem;
  border-radius: 100rem;
  transition:
    border-color $transition_fast,
    color $transition_fast,
    background $transition_fast;

  &:disabled {
    background-color: $gray_dark;
    color: $white;
    cursor: not-allowed;
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  &--brand {
    @include background-button();
  }

  &--error {
    @include background-button($red, $white, lighten($red, 5%), $white);
  }
}
</style>
