<script lang="ts" setup>
import { Input } from '@/types'

const props = withDefaults(defineProps<Input.Model>(), {
  label: '',
  modelValue: '',
  placeholder: ' ',
  errorMessage: '',
  required: true,
  disabled: false,
  useDadata: false,
  mask: '',
  type: Input.Types.TEXT,
  isUppercaseFirst: false,
  isUppercaseAll: false,
  isLabelRequired: false,
  hasClear: true,
  phoneCode: null,
  isLoading: false
})

const isFocused = ref<boolean>(false)

const emit = defineEmits<Input.Emits>()

const isVisiblePassword = ref<boolean>(false)

const model = computed<string | number>({
  get() {
    return props.modelValue
  },
  set(value: string | number) {
    let formattedValue = value?.toString()
    const trimValue = formattedValue.trim()

    if (props.isUppercaseAll && trimValue) {
      formattedValue = formattedValue.toUpperCase()
    } else if (props.isUppercaseFirst && trimValue) {
      formattedValue = trimValue.replace(trimValue[0], trimValue[0]?.toUpperCase())
    }
    emit('update:modelValue', formattedValue)
  }
})

const onInput = (event: Event): void => {
  emit('input', event)
}

const onFocus = (): void => {
  isFocused.value = true
}

const onBlur = (): void => {
  isFocused.value = false
  emit('blur')
}

const onClear = (): void => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div
    :class="{
      'base-input--error': errorMessage,
      'base-input--focused': isFocused,
      'base-input--label': label,
      'base-input--filled': model
    }"
    class="base-input"
  >
    <div class="base-input__wrapper">
      <label v-if="label" :for="name" class="text--input-label base-input__label">
        {{ label }}
        <span v-if="required" class="base-input__label--required" v-text="'*'" />
      </label>

      <div class="base-input__container">
        <span
          v-if="!isLoading && phoneCode && type === Input.Types.PHONE"
          class="base-input__phone-code"
          v-text="phoneCode ? `+${phoneCode}` : ''"
        />
        <input
          :id="name"
          v-model="model"
          v-maska
          :autocomplete="autocomplete"
          :data-maska="mask"
          :disabled="disabled"
          :name="name"
          :placeholder="placeholder"
          :type="type"
          :class="['text--input base-input__field', { 'base-input__field-phone': type === Input.Types.PHONE }]"
          @focus="onFocus"
          @input="onInput"
          @blur="onBlur"
        />

        <slot />
      </div>
    </div>

    <p v-if="errorMessage" class="text--input-label base-input__error-message" v-text="errorMessage" />
  </div>
</template>
<style lang="scss" scoped>
$input_min_height: $INPUT_MIN_HEIGHT;
$border_radius_small: $BORDER_RADIUS_SMALL;
$transition: $TRANSITION_SLOW;
$transition_fast: $TRANSITION_FAST;
$zLayerContent: 10;
$error: $SYSTEM_ERROR;
$brand_dark: $BRAND_DARK;
$brand_main: $BRAND_MAIN;
$gray: $GRAY;
$white: $BASE_WHITE;

.base-input {
  &__wrapper {
    position: relative;
    width: 100%;
    min-height: $input_min_height;
  }

  &--label {
    & .base-input__field {
      padding: 3.35rem 2rem 1.05rem 2rem;
    }

    .base-input__label {
      position: absolute;
      z-index: $zLayerContent;
      top: 50%;
      left: 2rem;
      transform: translateY(-50%);
      transition: all $transition_fast;
      color: $BRAND_MAIN;

      &--required {
        color: $error;
      }
    }
  }

  &--filled,
  &--focused {
    & .base-input__label {
      top: 1.05rem;
      left: 2rem;
      transform: translateY(0);
    }
  }

  &:not(.base-input--label) {
    & .base-input__field {
      padding: 2rem 1.05rem;
    }
  }

  &__field {
    display: flex;
    width: 100%;
    min-height: $input_min_height;
    border: 0.2rem solid $gray;
    border-radius: $border_radius_small;
    background-color: $white;
    color: $brand_main;
    outline: none;
    resize: none;
    transition:
      border $transition,
      color $transition,
      background-color $transition;

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

  &:not(&--error) {
    @include hover {
      .base-input__field:hover:not(.base-input__field:focus, .base-input__field:disabled) {
        border-color: $brand_main;
      }
    }
  }

  &--error {
    & .base-input__field {
      border-color: $error;
    }
  }

  &__error-message {
    color: $error;
  }
}
</style>
