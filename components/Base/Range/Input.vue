<script setup lang="ts">
import Datepicker, { type DatePickerInstance } from '@vuepic/vue-datepicker'

interface Props {
  modelValue: Date | string
  placeholder?: string
  type?: 'number' | 'date'
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  type: 'number',
  error: ''
})

const emit = defineEmits(['update:modelValue'])

const contentEditableRef = ref<HTMLDivElement | null>(null)
const datepickerRef = ref<DatePickerInstance>(null)
const isDatepickerVisible = ref(false)
const isFocused = ref<boolean>(false)

const inputValue = ref(props.modelValue)

const datePickerOptions = reactive({
  enabledDatePicker: false,
  hideInputIcon: true,
  format: 'dd.MM.yyyy',
  textInput: {
    format: 'dd.MM.yyyy'
  }
})

const focusContentEditable = () => {
  if (contentEditableRef.value && props.type !== 'date') {
    contentEditableRef.value.focus()
    isFocused.value = true
  } else {
    isDatepickerVisible.value = true
    if (datepickerRef.value) {
      datepickerRef.value.openMenu()
    }
  }
}

const onContentEditableInput = (event: Event): void => {
  const value = (event.target as HTMLDivElement).innerText // Получаем текст внутри contenteditable
  if (props.type === 'number') {
    const numericValue = value.replace(/\D/g, '') // Удаляем нечисловые символы
    inputValue.value = numericValue
    contentEditableRef.value.textContent = numericValue
    emit('update:modelValue', numericValue)
  }
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ru-RU').format(date) // Форматируем дату по локали 'ru-RU'
}

const onDateSelected = (date: Date): void => {
  const formattedDate = formatDate(date) // Форматируем дату
  inputValue.value = formattedDate
  emit('update:modelValue', formattedDate) // Отправляем отформатированную дату
  isDatepickerVisible.value = false // Скрываем Datepicker
  if (contentEditableRef.value) {
    contentEditableRef.value.textContent = formattedDate // Отображаем дату в contenteditable
  }
}

const onFocus = () => {
  isFocused.value = true
}

// Обрабатываем потерю фокуса
const onBlur = () => {
  isFocused.value = false
}
</script>

<template>
  <div
    class="base-range-input"
    :class="{
      'base-range-input--date': isDatepickerVisible,
      'base-range-input--focused': isFocused,
      'base-range-input--error': error
    }"
    @click.prevent="focusContentEditable"
  >
    <div class="base-range-input__placeholder text--input-label" v-text="placeholder" />
    <div class="base-range-input__content">
      <div
        ref="contentEditableRef"
        class="base-range-input__content-item text--input"
        contenteditable="true"
        @input="onContentEditableInput"
        @focus="onFocus"
        @blur="onBlur"
      />
      <datepicker
        v-if="isDatepickerVisible && type === 'date'"
        ref="datepickerRef"
        v-model="inputValue"
        class="base-range-input__date"
        v-bind="datePickerOptions"
        @update:model-value="onDateSelected"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
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

.base-range-input {
  display: flex;
  justify-content: space-between;
  width: 100%;
  min-height: $input_min_height;
  padding: 2.2rem 2rem;
  border: 0.2rem solid $gray;
  border-radius: $border_radius_small;
  background-color: $white;
  color: $brand_main;
  outline: none;
  resize: none;

  &:not(&--error) {
    &.base-range-input--focused {
      transition:
        border $transition,
        color $transition,
        background-color $transition;
      border-color: $brand_dark;
    }
  }

  &--error {
    border-color: $error;
  }

  &--date {
    & .base-range-input__content-item {
      opacity: 0;
    }
  }

  &__content {
    width: max-content;
    &-item {
      height: 100%;
      min-width: 2rem;
      outline: none;
      border: none;
    }
  }
  &__field {
    height: 100%;
    width: 100%;
  }

  &__date {
    & :deep(.dp__input_wrap) {
      opacity: 0;
      visibility: hidden;
      height: 0.1rem;
    }
  }
}

.hidden {
  display: none;
}
</style>
