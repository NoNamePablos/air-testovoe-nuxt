<script setup lang="ts">
interface Props {
  placeholderMin?: string
  placeholderMax?: string
  label?: string
  type?: 'number' | 'date'
  errorMessage?: string
  errorMin?: string
  errorMax?: string
  modelValue: {
    min: number | Date | string
    max: number | Date | string
  }
}

interface Emits {
  (
    event: 'update:modelValue',
    data: {
      min: number | Date | string
      max: number | Date | string
    }
  ): void
  (event: 'update:min', data: number | Date | string): void
  (event: 'update:max', data: number | Date | string): void
}

const emit = defineEmits<Emits>()

const props = withDefaults(defineProps<Props>(), {
  placeholderMin: 'от',
  placeholderMax: 'до',
  label: '',
  type: 'number',
  errorMessage: '',
  errorMin: '',
  errorMax: ''
})

const { modelValue } = toRefs(props)

const minValue = ref(modelValue.value.min)
const maxValue = ref(modelValue.value.max)

watch(minValue, (newVal) => {
  emit('update:modelValue', { min: newVal, max: maxValue.value })
  emit('update:min', newVal)
})

watch(maxValue, (newVal) => {
  emit('update:modelValue', { min: minValue.value, max: newVal })
  emit('update:max', newVal)
})
</script>
<template>
  <div class="base-range">
    <div v-if="label" class="base-range__label text--input-label" v-text="label" />
    <div class="base-range__wrapper">
      <BaseRangeInput
        v-model="minValue"
        class="base-range__input"
        :error="errorMin"
        :placeholder="placeholderMin"
        :type="type"
      />
      <BaseRangeInput
        v-model="maxValue"
        class="base-range__input"
        :error="errorMax"
        :placeholder="placeholderMax"
        :type="type"
      />
    </div>
    <p v-if="errorMessage" class="text--input-label base-range__error-message" v-text="errorMessage" />
  </div>
</template>

<style scoped lang="scss">
$brand_main: $BRAND_MAIN;
$error: $SYSTEM_ERROR;

.base-range {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__label {
    color: $brand_main;
  }

  &__input {
    flex-grow: 1;
  }

  &__wrapper {
    display: flex;
    column-gap: 0.8rem;
  }

  &__error-message {
    color: $error;
  }
}
</style>
