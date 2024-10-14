<script lang="ts" setup>
import { Icon, type Select } from '@/types'

const props = withDefaults(defineProps<Select.Model>(), {
  modelValue: '',
  name: '',
  tabindex: 0,
  searchValue: '',
  error: '',
  labelKey: 'value',
  hasSearch: false,
  isLoading: false,
  hasAsyncData: false,
  required: false,
  isNewValueAllowed: false,
  isMultiple: false,
  isDisabled: false,
  isLabelRequired: false,
  emptyOptionText: 'Нет доступных вариантов'
})

const emit = defineEmits<Select.Emits>()

const isOpen = ref<boolean>(false)
const list = ref<HTMLInputElement>()
const searchInput = ref<HTMLInputElement>()
const search = ref<string>('')

const isArrayModel = computed<boolean>(() => Array.isArray(props.modelValue))

const getOptionByValue = (item: Select.SelectValue): Select.SelectValue | undefined => {
  if (!item) {
    return undefined
  }

  return props.options?.find((option: Select.SelectValue) => {
    const findValue = typeof item === 'object' ? item[props.labelKey] : item
    const optionValue = typeof option === 'object' ? option[props.labelKey] : option

    return findValue.toString().toLowerCase() === optionValue.toString().toLowerCase()
  })
}

const filteredOptions = computed<Select.SelectValue[]>(() => {
  if (search.value && props.hasSearch) {
    return props.options.filter((item: Select.SelectValue) => {
      const searchValue = search.value.toLowerCase()
      const optionLabel = typeof item === 'object' ? item[props.labelKey] : item

      return optionLabel?.toString().toLowerCase().includes(searchValue)
    })
  }

  return props.options ?? []
})

const selectInputClasses = computed<{ [key: string]: boolean }>(() => {
  return {
    'base-select-input--open': isOpen.value,
    'base-select-input--error': !!props.error,
    'base-select-input--disabled': props.isDisabled || props.isLoading
  }
})

const selectMenuClasses = computed<{ [key: string]: boolean }>(() => {
  return {
    'base-select-menu--disabled': !filteredOptions.value,
    'base-select-menu--open': isOpen.value,
    'base-select-menu--searchable': props.hasSearch
  }
})

const addItem = (option: Select.SelectValue): void => {
  if (props.isMultiple && isArrayModel.value) {
    search.value = ''

    const isDuplicated = props.modelValue.find((item) => JSON.stringify(item) === JSON.stringify(option))

    if (isDuplicated) {
      return
    }
    console.log('selected: ', option)
    emit('update:modelValue', [...props.modelValue, option])
    return
  }

  emit('update:modelValue', option)

  isOpen.value = false
  search.value = typeof option === 'object' ? option[props.labelKey]?.toString() : option?.toString()
}

const removeItem = (item: Select.SelectValue): void => {
  const newValue = isArrayModel.value
    ? props.modelValue.filter((value: Select.SelectValue) => JSON.stringify(value) !== JSON.stringify(item))
    : ''

  emit('update:modelValue', newValue)
}

const isCheckedOption = (option: Select.SelectValue): boolean => {
  return isArrayModel.value
    ? props.modelValue.find((value: Select.SelectValue) => JSON.stringify(value) === JSON.stringify(option))
    : JSON.stringify(props.modelValue) === JSON.stringify(option)
}

const onSelect = (option: Select.SelectValue): void => {
  const isChecked = isCheckedOption(option)

  if (isChecked) {
    removeItem(option)
  } else {
    addItem(option)
  }
}

const onBlurInputSearch = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const item = getOptionByValue(search.value)
  let newValue: Select.SelectValue = ''

  if (item) {
    newValue = item
  } else if (props.isNewValueAllowed) {
    newValue = target.value
  }

  if (!props.isMultiple && !isArrayModel.value && !newValue) {
    emit('update:modelValue', '')
  }
}

const setActive = (): void => {
  if (!props.isDisabled && !props.isLoading) {
    isOpen.value = true
  }
}

const checkValue = (value: Select.SelectValue): void => {
  const option = props.options.find((option) => JSON.stringify(option) === JSON.stringify(value))

  if (!option && (typeof value === 'object' ? value[props.labelKey] : value)) {
    removeItem(value)
    search.value = ''
  }
}

watch(
  () => props.modelValue,
  () => {
    if (props.isNewValueAllowed) {
      search.value = typeof props.modelValue === 'object' ? props.modelValue[props.labelKey] : props.modelValue
      return
    }
    if (isArrayModel.value) {
      props.modelValue.forEach((value: Select.SelectValue) => {
        checkValue(value)
      })
    } else {
      checkValue(props.modelValue)
    }
  },
  { immediate: true }
)

watch(
  () => props.options,
  (value: Select.SelectValue[]) => {
    if (isOpen.value && props.hasAsyncData && props.hasSearch) {
      setTimeout(() => {
        searchInput.value?.focus()
      }, 0)
    }
  }
)
const checkClickOutside = (event: Event): void => {
  if (isOpen.value && !(event.target as HTMLElement).closest(`#base-select-${props.name}`)) {
    isOpen.value = false
    if (isArrayModel.value) {
      search.value = ''
    } else {
      search.value = typeof props.modelValue === 'object' ? props.modelValue[props.labelKey] : props.modelValue
    }

    emit('update:searchValue', '')
  }
}

onMounted(() => {
  document.body.addEventListener('click', checkClickOutside)

  if (!isArrayModel.value && props.hasSearch) {
    search.value = typeof props.modelValue === 'object' ? props.modelValue[props.labelKey] : props.modelValue
  }
})

onBeforeUnmount(() => {
  document.body.removeEventListener('click', checkClickOutside)
})

const clearSearch = (): void => {
  search.value = ''
  emit('update:searchValue', '')

  if (!props.isMultiple) {
    emit('update:modelValue', '')
  }
}
</script>

<template>
  <div
    :id="`base-select-${name}`"
    class="base-select"
    :class="{ 'base-select--focused': isOpen, 'base-select--value': modelValue }"
  >
    <div class="base-select__wrapper">
      <p v-if="label" class="text--input-label base-select-input__label">
        {{ label }}
        <span v-if="required" class="base-select-input__label--required" v-text="'*'" />
      </p>

      <div
        :class="selectInputClasses"
        :tabindex="tabindex"
        class="base-select-input"
        @click="setActive"
        @keydown.enter="setActive"
      >
        <ul v-if="isMultiple && isArrayModel && modelValue.length" class="base-select__options-preview">
          <li
            v-for="option in modelValue"
            :key="`select-option-${option}`"
            class="text--default base-select__option-preview"
          >
            <span>{{ typeof option === 'object' && labelKey ? option[labelKey] : option }}</span>

            <button aria-label="удалить" class="base-select__delete" @click="removeItem(option)">
              <BaseIcon :name="Icon.Models.CLOSE" />
            </button>
          </li>
        </ul>

        <input
          v-if="hasSearch"
          ref="searchInput"
          v-model="search"
          :disabled="isDisabled || isLoading"
          :name="name"
          :placeholder="isArrayModel && modelValue.length ? '' : placeholder"
          class="text--input base-select-input__input base-select-input__text"
          maxlength="50"
          type="text"
          @blur="onBlurInputSearch"
          @input="(event: Event) => emit('update:searchValue', (event.target as HTMLInputElement).value)"
        />

        <span
          v-else-if="isMultiple && isArrayModel"
          class="text--input base-select-input__text"
          v-text="!modelValue.length ? placeholder : ''"
        />

        <span
          v-else
          class="text--input base-select-input__text"
          v-text="(typeof modelValue === 'object' ? modelValue[props.labelKey] : modelValue) || placeholder"
        />

        <button
          v-if="isOpen && hasSearch && search && !isMultiple && !isDisabled && !isLoading"
          :disabled="isDisabled || isLoading"
          aria-label="очистить поиск"
          class="base-select__delete base-select__delete--global"
          @click="clearSearch"
        >
          <BaseIcon :is-svg="false" :name="Icon.Models.CLOSE" />
        </button>

        <div class="base-select-input__icon">
          <IconChevron
            v-if="!isLoading"
            :chevron="isOpen ? Icon.Directions.UP : Icon.Directions.DOWN"
            class="base-select-input__icon-icon"
          />
        </div>
      </div>

      <Transition name="fade">
        <div v-show="isOpen" class="base-select-menu-wrapper">
          <ul ref="list" :class="selectMenuClasses" class="base-select-menu">
            <li
              v-for="option in filteredOptions"
              :key="`select-option-${JSON.stringify(option)}`"
              :class="{ 'base-select-menu__option--selected': isCheckedOption(option) }"
              :tabindex="tabindex"
              class="base-select-menu__option"
              @click="onSelect(option)"
            >
              {{ typeof option === 'object' && labelKey ? option[labelKey] : option }}
            </li>

            <li
              v-show="!filteredOptions.length"
              class="base-select-menu__option base-select-menu__option--disabled"
              v-html="emptyOptionText"
            />
          </ul>
        </div>
      </Transition>
    </div>

    <p v-if="error" class="text--input-label base-select__error-message" v-text="error" />
  </div>
</template>

<style lang="scss" scoped>
$grey: $GRAY;
$grey_placeholder: $GRAY;
$blue: $BRAND_DARK;
$blue_light: $BRAND_MAIN;
$white: $BASE_WHITE;
$error: $SYSTEM_ERROR;
$error_background: $SYSTEM_ERROR;
$transition: $TRANSITION_SLOW;
$transition_fast: $TRANSITION_FAST;
$input_min_height: $INPUT_MIN_HEIGHT;
$input_border_radius: $INPUT_BORDER_RADIUS;
$border_radius_large: $BORDER_RADIUS_SMALL;
$scrollbar_color: $GRAY;
$scrollbar_active_color: $BRAND_MAIN;
$gray: $GRAY;

$brand_main: $BRAND_MAIN;

.base-select {
  position: relative;
  width: 100%;

  &__wrapper {
    position: relative;

    &:has(.base-select-input--disabled) {
      cursor: no-drop;
    }
  }

  &__input-wrapper {
    position: relative;
  }

  &--focused,
  &--value {
    & .base-select-input__label {
      top: 1.05rem;
      left: 2rem;
      transform: translateY(0);
    }
  }

  &-input {
    &__input {
      width: 100%;
    }
    position: relative;
    display: flex;
    min-height: $input_min_height;
    flex-wrap: wrap;
    align-items: center;
    padding: 3.35rem 5rem 1.05rem 2rem;
    border: 0.2rem solid $gray;
    border-radius: $border_radius_large;
    background-color: $white;
    color: $brand_main;
    cursor: pointer;
    gap: 0.4rem 0.6rem;
    outline: none;
    transition:
      border $transition,
      background-color $transition;
    user-select: none;

    &--open {
      .base-select-input__label {
        color: $blue;
      }
    }

    &:not(&--error, &--disabled) {
      &:focus,
      &:active {
        border-color: $blue;
      }

      @include hover {
        &:hover {
          border-color: $blue;
        }
      }
    }

    &--error:not(&--disabled) {
      border-color: $error;

      .base-select-input__text {
        color: $error;

        &::placeholder {
          color: $error;
        }
      }

      .base-select-input__icon {
        &:deep(path) {
          stroke: $error;
        }
      }
    }

    &--disabled {
      pointer-events: none;

      .base-select-input__label {
        color: $grey_placeholder;
      }

      .base-select-input__text {
        color: $grey_placeholder;

        &::placeholder {
          color: $grey_placeholder;
        }
      }

      .base-select-input__icon {
        &:deep(path) {
          stroke: $grey_placeholder;
        }
      }
    }

    &__text {
      display: -webkit-box;
      overflow: hidden;
      flex: auto;
      padding-right: 1rem;
      border: none;
      background: transparent;
      -webkit-box-orient: vertical;
      color: $brand_main;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      outline: none;
      resize: none;
      text-overflow: ellipsis;
      transition: color $transition_fast;

      &::placeholder {
        color: $grey;
      }
    }

    &__label {
      position: absolute;
      z-index: 20;
      top: 50%;
      left: 2rem;
      transform: translateY(-50%);
      display: -webkit-box;
      overflow: hidden;
      max-width: 90%;
      -webkit-box-orient: vertical;
      color: $brand_main;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      text-overflow: ellipsis;
      transition: all $transition_fast;

      &--required {
        color: $error;
      }
    }

    &__icon {
      position: absolute;
      right: 2rem;
      width: 2rem;
      top: 50%;
      transform: translateY(-50%);
      &-icon {
        transition:
          transform $transition_fast,
          fill $transition_fast;
      }
    }

    &__loader {
      position: absolute;
      right: 2rem;
      background-color: transparent;
    }
  }

  &-menu {
    &-wrapper {
      position: absolute;
      z-index: 30;
      top: 100%;
      left: 0;
      overflow: hidden auto;
      width: 100%;
      max-height: 22.3rem;
      padding: 1rem 0;
      border-radius: $border_radius_large;
      background-color: $white;
      box-shadow:
        0.8rem 0.8rem 1.6rem 0 rgba(0, 0, 0, 8%),
        0 0 0.4rem 0 rgba(0, 0, 0, 4%);
      @include scrollbar;
    }

    &__option {
      width: 100%;
      padding: 0.62rem 1rem;
      border: none;
      background-color: transparent;
      cursor: pointer;
      text-align: left;
      transition:
        background-color $transition,
        color $transition;

      &:focus,
      &:active {
        background-color: $blue_light;
      }

      @include hover {
        &:hover {
          background-color: $blue_light;
          color: $white;
        }
      }

      &--selected {
        background-color: $blue_light;
        color: $white;
      }
    }

    &__option-search {
      display: flex;
    }
  }

  &__options-preview {
    display: contents;
  }

  &__option-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.6rem 1.5rem;
    border-radius: 6rem;
    background: $blue_light;
    box-shadow: 0 0 2rem 0 rgba(0, 0, 0, 10%);
    color: $grey;
    font-size: 1.4rem;
    font-style: normal;
    font-weight: 500;
    gap: 0.5rem;
    line-height: normal;
    text-transform: uppercase;

    @include mobile {
      padding: 0.4rem 1.2rem;
      font-size: 1.2rem;
    }
  }

  &__delete {
    color: $white;

    &--global {
      position: absolute;
      right: 4rem;
    }
    display: flex;
    width: 1.6rem;
    height: 1.6rem;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
  }

  &__error-message {
    color: $error;
  }
}
</style>
