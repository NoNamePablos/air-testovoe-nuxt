<script setup lang="ts">
import { VueDadata } from 'vue-dadata'

interface Props {
  modelValue: string
  label?: string
  name: string
  errorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Адрес',
  errorMessage: ''
})

const { apiDadataKey } = useRuntimeConfig().public

interface Emits {
  (event: 'update:modelValue', data: string): void
}

const emit = defineEmits<Emits>()

const model = computed<string>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const isFocused = ref<boolean>(false)

const onFocus = (): void => {
  isFocused.value = true
}

const onBlur = (): void => {
  isFocused.value = false
}

const checkClickOutside = (event: Event): void => {
  if (isFocused.value && !(event.target as HTMLElement).closest(`#base-dadata-${props.name}`)) {
    onBlur()
  }
}

onMounted(() => {
  document.body.addEventListener('click', checkClickOutside)
})

onBeforeUnmount(() => {
  document.body.removeEventListener('click', checkClickOutside)
})
</script>

<template>
  <div
    :id="`base-dadata-${props.name}`"
    class="base-dadata"
    :class="{ 'base-dadata--focused': isFocused, 'base-dadata--value': model, 'base-dadata--error': errorMessage }"
    @click="onFocus"
  >
    <div class="base-dadata__label text--input-label" v-text="label" />
    <VueDadata v-model="model" :token="apiDadataKey" />
    <p v-if="errorMessage" class="text--input-label base-dadata__error-message" v-text="errorMessage" />
  </div>
</template>

<style scoped lang="scss">
$input_min_height: $INPUT_MIN_HEIGHT;
$border_radius_small: $BORDER_RADIUS_SMALL;
$error: $SYSTEM_ERROR;
$brand_dark: $BRAND_DARK;
$brand_main: $BRAND_MAIN;
$gray: $GRAY;
$white: $BASE_WHITE;
$transition: $TRANSITION_FAST;

.base-dadata {
  position: relative;

  &--focused,
  &--value {
    & .base-dadata__label {
      top: 1.05rem;
      left: 2rem;
      transform: translateY(0);
    }
  }

  &__label {
    position: absolute;
    z-index: 7;
    top: 50%;
    left: 2rem;
    transform: translateY(-50%);
    transition: all $transition;
    color: $brand_main;
  }

  & :deep(.vue-dadata__input) {
    min-height: $input_min_height;
    border: 0.2rem solid $gray;
    border-radius: $border_radius_small;
    background-color: $white;
    color: $brand_main;
    padding: 3.3rem 2rem 1.05rem 2rem;
    outline: none;
    resize: none;
    box-shadow: none;
    transition:
      border $transition,
      color $transition,
      background-color $transition;

    @extend .text--input;

    &::placeholder {
      color: $brand_main;
    }

    &:focus {
      border-color: $brand_main;
    }

    &:not(:placeholder-shown) {
      color: $brand_main;
    }

    &:disabled {
      background: transparent;
      color: $brand_dark;
      cursor: no-drop;
    }
  }

  & :deep(.vue-dadata__suggestions) {
    border-radius: $border_radius_small;
    background-color: $white;
    box-shadow:
      0.8rem 0.8rem 1.6rem 0 rgba(0, 0, 0, 8%),
      0 0 0.4rem 0 rgba(0, 0, 0, 4%);
  }

  & :deep(.vue-dadata__suggestions-item) {
    border: none;
    background-color: transparent;
    cursor: pointer;
    text-align: left;
    transition:
      background-color $transition,
      color $transition;

    &:focus,
    &:active {
      background-color: $brand_main;
    }

    @include hover {
      &:hover {
        background-color: $brand_main;
        color: $white;
      }
    }

    & :deep(.vue-dadata__suggestions-item_current) {
      background-color: $brand_main;
      color: $white;
    }
  }

  &--error {
    & :deep(.vue-dadata__input) {
      border-color: $error;
    }
  }

  &__error-message {
    position: absolute;
    color: $error;
  }
}
</style>
